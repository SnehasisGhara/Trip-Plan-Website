import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider, firestore } from "../Firebase/Firebase";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCart } from "../Context/CartContext";

// i want in header section , after authentication  update header with user profile picture , and when header ujpdate  saw the extra two button one hotels cart and another is trip history .  by shadcn using  popover component for logout funtion when clicking user profile   ,also when user logout irs redirect home page  

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { cart } = useCart();


  // Listen to auth state changes and fetch user data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Fetch user data from Firestore
        const userRef = doc(firestore, "trips", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Fetched user data:", userData);
          setCurrentUser(userData);
        } else {
          // If user data is not found, create a new user document
          const userData = {
            name: user.displayName,
            email: user.email,
            profilePic: user.photoURL,
            uid: user.uid,
          };
          await setDoc(userRef, userData);
          setCurrentUser(userData);
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userData = {
        name: user.displayName,
        email: user.email,
        profilePic: user.photoURL,
        uid: user.uid,
      };
      const userRef = doc(firestore, "trips", user.uid);
      await setDoc(userRef, userData);
      setCurrentUser(userData);
      toast.success(`Welcome, ${user.displayName}`);
      setIsOpen(false);
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("Failed to sign in. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Sign-out error:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-20 bg-transparent">
      <div className="flex justify-between items-center px-4 sm:px-8 py-2 lg:py-4">
        {/* Logo */}
        <img src="Logo1.png" alt="Logo" className="w-20 sm:w-24 h-auto" />

        {/* Navigation Items */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              {/* Hotels Cart Button */}
              <Button
                variant="outline"
                className="bg-white/20 backdrop-blur-sm rounded-full"
                onClick={() => navigate("/hotels-cart")}
              >
                Hotels Cart
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                    {cart.length}
                  </span>
                )}
              </Button>

              {/* User Profile Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="rounded-full overflow-hidden hover:ring-2 hover:ring-blue-500 transition">
                    {currentUser.profilePic ? (
                      <img
                        src={currentUser.profilePic}
                        alt={currentUser.name}
                        className="w-5 sm:w-10 h-5 sm:h-10 object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        {currentUser.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-64"
                  align="end"
                  alignOffset={1}
                  sideOffset={4}
                >
                  <div className="flex flex-col gap-2 p-2">
                    <div className="px-2 py-1 text-base font-medium">
                      {currentUser.name}
                    </div>
                    <div className="px-2 py-1 text-xs text-gray-500 break-all">
                      {currentUser.email}
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleSignOut}
                      className="w-full mt-2"
                    >
                      Sign Out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            /* Sign-In Dialog */
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white font-signature font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-full transition-transform hover:scale-105">
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className="w-80 p-6">
                <DialogHeader className="text-lg font-bold text-center">Sign In</DialogHeader>
                <div className="flex flex-col items-center gap-4">
                  <Button
                    onClick={handleGoogleSignIn}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border w-full justify-center bg-black"
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" className="w-6 h-6" />
                    <span className="text-yellow-100">Continue with Google</span>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
