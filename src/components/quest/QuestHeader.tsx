
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface QuestHeaderProps {
  title: string;
  onBack: () => void;
}

const QuestHeader = ({ title, onBack }: QuestHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 py-3 flex items-center shadow-lg">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onBack}
        className="text-white hover:bg-slate-500 mr-2 rounded-xl"
      >
        <ArrowLeft size={20} />
      </Button>
      <h1 className="text-xl font-bold font-serif">{title}</h1>
    </div>
  );
};

export default QuestHeader;
