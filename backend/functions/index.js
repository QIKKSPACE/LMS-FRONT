const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");
const cors = require("cors")({ origin: true });

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

/**
 * CLOUD FUNCTION: Verify Razorpay Payment
 */
exports.verifyPayment = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      console.log(" Payment verification request received");

      // Only allow POST requests
      if (req.method !== "POST") {
        return res.status(405).json({
          success: false,
          error: "Method not allowed. Use POST.",
        });
      }

      // Extract payment data from request body
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        courseId,
        courseTitle,
        amount,
        currency,
        userId,
        userEmail,
        userName,
      } = req.body;

      console.log("📦 Payment data received:", {
        razorpay_payment_id,
        razorpay_order_id: razorpay_order_id || "N/A",
        razorpay_signature: razorpay_signature || "N/A",
        courseId,
        userId,
        amount,
      });

      // Validate required fields
      if (!razorpay_payment_id || !courseId || !userId) {
        console.error(" Missing required fields:", {
          has_payment_id: !!razorpay_payment_id,
          has_courseId: !!courseId,
          has_userId: !!userId
        });
        return res.status(400).json({
          success: false,
          error: "Missing required payment information",
        });
      }

      console.log("Verifying Razorpay payment...");

      // Check if signature exists (for order-based payments)
      if (razorpay_signature && razorpay_order_id) {
        console.log(" Verifying payment signature (order-based payment)...");
        
        const razorpaySecret = functions.config().razorpay.key_secret;

        if (!razorpaySecret) {
          console.error(" Razorpay secret not configured");
          return res.status(500).json({
            success: false,
            error: "Payment gateway not configured",
          });
        }

        const signatureString = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
          .createHmac("sha256", razorpaySecret)
          .update(signatureString)
          .digest("hex");

        if (razorpay_signature !== expectedSignature) {
          console.error(" Invalid payment signature - possible fraud!");
          return res.status(400).json({
            success: false,
            error: "Payment verification failed. Invalid signature.",
          });
        }

        console.log(" Payment signature verified successfully");
      } else {
        console.log("ℹ️ Direct payment (no order). Payment ID:", razorpay_payment_id);
        console.log(" Signature verification skipped - Direct payment");
      }

      // ============================================
      // STEP 2: CHECK IF ALREADY PURCHASED
      // ============================================
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        console.error(" User not found:", userId);
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const userData = userDoc.data();
      const currentPurchasedCourses = userData.purchasedCourses || [];

      if (currentPurchasedCourses.includes(courseId)) {
        console.log("Course already purchased");
        return res.status(200).json({
          success: true,
          alreadyPurchased: true,
          message: "Course already in your library",
        });
      }

      // ============================================
      // STEP 3: GET COURSE DATA
      // ============================================
      console.log("📚 Fetching course data...");

      let courseRef = db.collection("courses").doc(courseId);
      let courseDoc = await courseRef.get();
      let isOverlay = false;
      let courseSource = "courses";

      if (!courseDoc.exists) {
        console.log("🔍 Checking overlayCourses collection...");
        courseRef = db.collection("overlayCourses").doc(courseId);
        courseDoc = await courseRef.get();
        isOverlay = true;
        courseSource = "overlay";
      }

      if (!courseDoc.exists) {
        console.error("Course not found:", courseId);
        return res.status(404).json({
          success: false,
          error: "Course not found",
        });
      }

      const courseData = courseDoc.data();
      console.log(" Course found:", courseData.courseTitle, "| Source:", courseSource);

      // Calculate expiry date
      const now = new Date();
      const validityMonths = parseInt(courseData.courseValidity || "1");
      const expiryDate = new Date(now);
      expiryDate.setMonth(expiryDate.getMonth() + validityMonths);

      console.log("📅 Course validity:", {
        months: validityMonths,
        expiryDate: expiryDate.toISOString(),
      });

      console.log("📝 Enrolling user in course...");

      const timestamp = new Date().toISOString();

      await userRef.update({
        purchasedCourses: admin.firestore.FieldValue.arrayUnion(courseId),
        updatedAt: timestamp,
      });

      console.log(" Course added to user's purchases");

      console.log(" Initializing course progress...");

      let totalLectures = 0;
      if (courseData.courseContent && Array.isArray(courseData.courseContent)) {
        courseData.courseContent.forEach((chapter) => {
          if (chapter.chapterContent && Array.isArray(chapter.chapterContent)) {
            totalLectures += chapter.chapterContent.length;
          }
        });
      }

      console.log("📚 Total lectures in course:", totalLectures);

      const progressId = `${userId}_${courseId}`;
      const progressRef = db.collection("userCourseProgress").doc(progressId);

      await progressRef.set({
        progressId: progressId,
        userId: userId,
        courseId: courseId,
        progress: 0,
        status: "IN_PROGRESS",
        completedLectures: [],
        totalLectures: totalLectures,
        enrolledAt: timestamp,
        lastAccessedAt: timestamp,
        expiryDate: expiryDate.toISOString(),
        createdAt: timestamp,
      });

      console.log(" Course progress initialized");

      console.log("💾 Saving transaction record...");

      const transactionId = `txn_${Date.now()}_${userId.substring(0, 8)}`;
      const transactionRef = db.collection("transactions").doc(transactionId);

      //  CRITICAL FIX: Create transaction data WITHOUT undefined values
      const transactionData = {
        transactionId: transactionId,
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id || "",  //  Use empty string instead of undefined
        razorpaySignature: razorpay_signature || "",  //  Use empty string instead of undefined
        courseId: courseId,
        courseTitle: courseTitle || courseData.courseTitle || "Course",
        amount: amount || 0,
        currency: currency || "INR",
        userId: userId,
        userEmail: userEmail || "",
        userName: userName || "",
        status: "SUCCESS",
        paymentMethod: "razorpay",
        verified: true,
        verifiedAt: timestamp,
        paymentDate: timestamp,
        createdAt: timestamp,
        source: courseSource,  // Track if from overlay or regular courses
        expiryDate: expiryDate.toISOString(),
      };

      console.log(" Transaction data prepared (no undefined values)");

      await transactionRef.set(transactionData);

      console.log(" Transaction saved:", transactionId);

      console.log("🎉 Payment verification complete!");

      return res.status(200).json({
        success: true,
        message: "Payment verified and course enrolled successfully",
        data: {
          transactionId: transactionId,
          courseId: courseId,
          expiryDate: expiryDate.toISOString(),
          totalLectures: totalLectures,
        },
      });

    } catch (error) {
      console.error(" Error verifying payment:", error);
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
      
      return res.status(500).json({
        success: false,
        error: "Internal server error during payment verification",
        details: error.message,
      });
    }
  });
});


exports.getUserTransactions = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      if (req.method !== "GET") {
        return res.status(405).json({
          success: false,
          error: "Method not allowed. Use GET.",
        });
      }

      const userId = req.query.userId;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: "userId parameter is required",
        });
      }

      console.log("📜 Fetching transactions for user:", userId);

      const transactionsSnapshot = await db
        .collection("transactions")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .limit(50)
        .get();

      const transactions = [];
      transactionsSnapshot.forEach((doc) => {
        transactions.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log("Found", transactions.length, "transactions");

      return res.status(200).json({
        success: true,
        transactions: transactions,
      });

    } catch (error) {
      console.error(" Error fetching transactions:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });
});