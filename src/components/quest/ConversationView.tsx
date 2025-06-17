
import { Button } from "@/components/ui/button";
import QuestHeader from "./QuestHeader";

interface ConversationViewProps {
  conversation: string[];
  onBack: () => void;
  onComplete: () => void;
}

const ConversationView = ({ conversation, onBack, onComplete }: ConversationViewProps) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <QuestHeader title="Conversation" onBack={onBack} />
      
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="space-y-4">
            {conversation.map((line, index) => (
              <div 
                key={index}
                className={`p-3 rounded-2xl ${
                  line.startsWith('You:') 
                    ? 'bg-blue-100 text-blue-800 ml-4' 
                    : 'bg-slate-100 text-slate-800 mr-4'
                }`}
              >
                <p className="font-serif text-sm">{line}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-end space-x-2">
            <Button 
              onClick={onBack}
              variant="outline"
              className="font-serif rounded-xl"
            >
              Back
            </Button>
            <Button 
              onClick={onComplete}
              className="bg-slate-600 hover:bg-slate-700 text-white font-serif rounded-xl"
            >
              Complete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;
