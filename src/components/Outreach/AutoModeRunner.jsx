import { ConversationView } from './ConversationView.jsx';
import { InterestResult } from './InterestResult.jsx';

export const AutoModeRunner = ({ candidate, messages, interest }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <div className="w-2 h-2 bg-emerald-400 rounded-full" />
        Auto Mode — AI managed this conversation autonomously
      </div>
      <ConversationView
        candidate={candidate}
        messages={messages}
        interest={null}
        autoReveal={false}
      />
      {interest && <InterestResult interest={interest} />}
    </div>
  );
};

export default AutoModeRunner;
