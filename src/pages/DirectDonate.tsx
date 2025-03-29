import { useState } from "react";
import Header from "../components/Header";
import BackButton from "../components/BackButton";
import { Check, Info, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NGO_LIST = [
  {
    id: "1",
    name: "Haven Shelter",
    description:
      "Emergency shelter providing beds, meals, and basic necessities.",
  },
  {
    id: "2",
    name: "New Beginnings Center",
    description: "Support services including counseling and job training.",
  },
  {
    id: "3",
    name: "Community Health Clinic",
    description: "Free or low-cost healthcare services for those in need.",
  },
  {
    id: "4",
    name: "Daily Bread Food Bank",
    description: "Provides emergency food assistance to those in need.",
  },
];

const DonationOption = ({
  name,
  amount,
  selected,
  onSelect,
}: {
  name: string;
  amount: string;
  selected: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    className={`border rounded-lg p-4 text-center transition-all ${
      selected
        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
        : "border-border hover:border-primary/30"
    }`}
    onClick={onSelect}
  >
    <p className="text-xl font-bold mb-1">₹{amount}</p>
    <p className="text-sm text-muted-foreground">{name}</p>
  </button>
);

const ThankYouPage = ({
  amount,
  onMakeAnotherDonation,
  onReturnHome,
}: {
  amount: string;
  onMakeAnotherDonation: () => void;
  onReturnHome: () => void;
}) => (
  <div className="min-h-screen flex flex-col bg-background">
    <Header title="Thank You" />
    <main className="flex-1 container-padding max-w-screen-lg mx-auto">
      <div className="mb-6">
        <BackButton to="/select-type" />
      </div>

      <div className="glass-card rounded-xl p-8 text-center animate-fade-in">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <Check className="text-green-600" size={48} />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gradient-primary">
          Thank You for Your Donation!
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your contribution of ₹{amount} will help create meaningful change in
          someone's life.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <div className="text-2xl font-bold text-blue-600 mb-2">1+</div>
            <div className="text-sm text-blue-700">Lives Impacted</div>
          </div>
          <div className="p-4 rounded-lg bg-green-50 border border-green-100">
            <div className="text-2xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-sm text-green-700">Support Available</div>
          </div>
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
            <div className="text-2xl font-bold text-purple-600 mb-2">100%</div>
            <div className="text-sm text-purple-700">Transparency</div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onMakeAnotherDonation}
            className="btn-primary w-full max-w-xs bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all duration-300"
          >
            Make Another Donation
          </button>
          <button
            onClick={onReturnHome}
            className="w-full max-w-xs py-2.5 px-5 rounded-lg border border-border bg-white hover:bg-gray-50 transition-all duration-300 text-sm font-medium"
          >
            Return to Home
          </button>
        </div>
      </div>
    </main>
  </div>
);

const DirectDonate = () => {
  const [selectedNGO, setSelectedNGO] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const navigate = useNavigate();

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowThankYou(true);
  };

  const handleMakeAnotherDonation = () => {
    setShowThankYou(false);
    setSelectedNGO("");
    setDonationAmount("");
    setCustomAmount("");
  };

  const handleReturnHome = () => {
    navigate("/select-type");
  };

  if (showThankYou) {
    return (
      <ThankYouPage
        amount={donationAmount || customAmount}
        onMakeAnotherDonation={handleMakeAnotherDonation}
        onReturnHome={handleReturnHome}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header title="Direct Donate" />
      <main className="flex-1 container-padding max-w-screen-lg mx-auto">
        <div className="mb-6">
          <BackButton to="/select-type" />
        </div>

        <h1 className="heading-2 mb-2">Donate to Support Services</h1>
        <p className="text-muted-foreground mb-8">
          Your donation helps create sustainable solutions
        </p>

        <div className="mb-6 glass-card rounded-lg p-4 flex items-start gap-3">
          <Info size={20} className="text-primary mt-0.5" />
          <div>
            <p className="font-medium">Why Donate Through LendAHand?</p>
            <p className="text-sm text-muted-foreground">
              Your donation supports organizations that provide job training,
              housing assistance, healthcare, and other critical services that
              help people build sustainable futures.
            </p>
          </div>
        </div>

        <form onSubmit={handleDonate} className="space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              Select an Organization
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {NGO_LIST.map((ngo) => (
                <button
                  key={ngo.id}
                  type="button"
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all text-left ${
                    selectedNGO === ngo.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border hover:border-primary/30"
                  }`}
                  onClick={() => setSelectedNGO(ngo.id)}
                >
                  <div className="w-12 h-12 bg-accent rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="font-medium">{ngo.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {ngo.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Choose Amount</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <DonationOption
                name="One Meal"
                amount="500"
                selected={donationAmount === "500"}
                onSelect={() => {
                  setDonationAmount("500");
                  setCustomAmount("");
                }}
              />
              <DonationOption
                name="One Day"
                amount="2000"
                selected={donationAmount === "2000"}
                onSelect={() => {
                  setDonationAmount("2000");
                  setCustomAmount("");
                }}
              />
              <DonationOption
                name="One Week"
                amount="5000"
                selected={donationAmount === "5000"}
                onSelect={() => {
                  setDonationAmount("5000");
                  setCustomAmount("");
                }}
              />
              <DonationOption
                name="One Month"
                amount="10000"
                selected={donationAmount === "10000"}
                onSelect={() => {
                  setDonationAmount("10000");
                  setCustomAmount("");
                }}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="customAmount" className="text-sm font-medium">
                Custom Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  ₹
                </span>
                <input
                  id="customAmount"
                  type="text"
                  className="input-field w-full pl-8"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setDonationAmount("");
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-4 text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedNGO || (!donationAmount && !customAmount)}
          >
            <span className="flex items-center justify-center gap-2">
              <Heart className="w-5 h-5" />
              Donate Now
            </span>
          </button>
        </form>
      </main>
    </div>
  );
};

export default DirectDonate;
