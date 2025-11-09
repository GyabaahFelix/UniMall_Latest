import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !subscribed) {
      toast.error("Please enter email and accept subscription");
      return;
    }
    toast.success("Thanks for subscribing!");
    setEmail("");
    setSubscribed(false);
  };

  return (
    <footer className="bg-muted/30 border-t border-border mt-16">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Newsletter */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                UNIMALL
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Your trusted campus marketplace for affordable, everyday essentials.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <h3 className="font-semibold">Subscribe to Our Newsletter</h3>
              <Input
                type="email"
                placeholder="Email*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="subscribe"
                  checked={subscribed}
                  onCheckedChange={(checked) => setSubscribed(checked as boolean)}
                />
                <label htmlFor="subscribe" className="text-xs text-muted-foreground leading-none">
                  Yes, subscribe me to your newsletter.*
                </label>
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </div>

          {/* Shop & Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-primary transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="hover:text-primary transition-colors">
                  Accessibility Statement
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Headquarters */}
          <div>
            <h3 className="font-semibold mb-4">Headquarters</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>University of Ghana, Legon</p>
              <p>Accra, Ghana</p>
              <p className="flex items-center space-x-1">
                <span>📧</span>
                <a href="mailto:info@unimall.com" className="hover:text-primary transition-colors">
                  info@unimall.com
                </a>
              </p>
              <p className="flex items-center space-x-1">
                <span>📞</span>
                <span>+233 24 540 2719</span>
              </p>
              <p className="flex items-center space-x-1">
                <span>📞</span>
                <span>+233 26 416 0654</span>
              </p>
            </div>
          </div>

          {/* Socials & Payment */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Socials</h3>
              <div className="flex flex-wrap gap-3">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  TikTok
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  YouTube
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Pay Securely with</h3>
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <span>MTN MoMo</span>
                <span>Vodafone Cash</span>
                <span>UnionPay</span>
                <span>JCB</span>
                <span>Discover</span>
                <span>Visa</span>
                <span>Mastercard</span>
                <span>PayPal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          © 2025 by UniMall. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
