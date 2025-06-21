import { useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import HelpModal from './HelpModal';

const HelpButton = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <button 
        className="help-button"
        onClick={() => setShowHelp(true)}
        title="Show Help"
      >
        <FaQuestionCircle />
        <span>Help</span>
      </button>
      
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
};

export default HelpButton;