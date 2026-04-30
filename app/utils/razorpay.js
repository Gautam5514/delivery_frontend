let razorpayLoader = null;

export const loadRazorpayCheckout = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay checkout can only load in the browser."));
  }

  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (razorpayLoader) return razorpayLoader;

  razorpayLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
        return;
      }
      reject(new Error("Razorpay checkout loaded, but Razorpay is unavailable."));
    };
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout."));
    document.body.appendChild(script);
  });

  return razorpayLoader;
};
