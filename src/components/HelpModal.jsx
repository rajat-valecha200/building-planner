import { FaArrowsAlt, FaCircle, FaEye, FaEyeSlash, FaFileExport, FaFileImport, FaHandPointer, FaMousePointer, FaPencilRuler, FaSyncAlt, FaTimes, FaTrash, FaVectorSquare } from 'react-icons/fa';

const HelpModal = ({ onClose }) => {
  return (
    <div className="help-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Building Planner Help Guide</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="help-section">
            <h3><FaMousePointer /> Getting Started</h3>
            <p>
              Welcome to Building Planner! This tool helps you create and annotate building plans.
              Follow these instructions to get the most out of the application.
            </p>
          </div>
          
          <div className="help-section">
            <h3><FaPencilRuler /> Drawing Tools</h3>
            <div className="tool-list">
              <div className="tool-item">
                <div className="tool-icon"><FaMousePointer /></div>
                <div className="tool-info">
                  <strong>Select Tool</strong>
                  <p>Click on shapes to select them. Drag to move, or use the properties panel to edit.</p>
                </div>
              </div>
              
              <div className="tool-item">
                <div className="tool-icon"><FaPencilRuler /></div>
                <div className="tool-info">
                  <strong>Line Tool</strong>
                  <p>Click and drag to draw straight lines. Drag endpoints to adjust after creation.</p>
                </div>
              </div>
              
              <div className="tool-item">
                <div className="tool-icon"><FaVectorSquare /></div>
                <div className="tool-info">
                  <strong>Rectangle Tool</strong>
                  <p>Click and drag to draw rectangles. Drag corners to resize or rotate.</p>
                </div>
              </div>
              
              <div className="tool-item">
                <div className="tool-icon"><FaCircle /></div>
                <div className="tool-info">
                  <strong>Circle Tool</strong>
                  <p>Click and drag to draw circles. Drag edges to resize or rotate.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="help-section">
            <h3><FaArrowsAlt /> Editing Shapes</h3>
            <div className="instruction-grid">
              <div className="instruction-item">
                <div className="instruction-icon"><FaHandPointer /></div>
                <div className="instruction-text">
                  <strong>Moving Shapes</strong>
                  <p>Click and drag the body of a shape to move it around the canvas.</p>
                </div>
              </div>
              
              <div className="instruction-item">
                <div className="instruction-icon"><FaSyncAlt /></div>
                <div className="instruction-text">
                  <strong>Rotating Shapes</strong>
                  <p>Drag the pink rotation handle above a selected shape to rotate it.</p>
                </div>
              </div>
              
              <div className="instruction-item">
                <div className="instruction-icon"><FaMousePointer /></div>
                <div className="instruction-text">
                  <strong>Editing Lines</strong>
                  <p>Drag the blue (start) or red (end) points to adjust line position.</p>
                </div>
              </div>
              
              <div className="instruction-item">
                <div className="instruction-icon"><FaTrash /></div>
                <div className="instruction-text">
                  <strong>Deleting Shapes</strong>
                  <p>Select a shape and press Delete, or use the Delete button in the properties panel.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="help-section">
            <h3><FaEye /> View Options</h3>
            <div className="view-options">
              <div className="option-item">
                <FaEye />
                <span>Show Dimensions</span>
                <p>Toggle dimension annotations on/off</p>
              </div>
              <div className="option-item">
                <FaEyeSlash />
                <span>Hide Dimensions</span>
                <p>Hide measurement annotations</p>
              </div>
            </div>
          </div>
          
          <div className="help-section">
            <h3><FaFileExport /> Project Management</h3>
            <div className="project-actions">
              <div className="action-item">
                <FaFileExport />
                <span>Export</span>
                <p>Save your design as a JSON file</p>
              </div>
              <div className="action-item">
                <FaFileImport />
                <span>Import</span>
                <p>Load a previously saved design</p>
              </div>
              <div className="action-item">
                <FaTrash />
                <span>Clear All</span>
                <p>Remove all shapes from the canvas</p>
              </div>
            </div>
          </div>
          
          <div className="help-section">
            <h3>Keyboard Shortcuts</h3>
            <div className="shortcuts">
              <div className="shortcut-item">
                <kbd>Delete</kbd>
                <span>Delete selected shape</span>
              </div>
              <div className="shortcut-item">
                <kbd>Ctrl</kbd> + <kbd>Click</kbd>
                <span>Select multiple shapes</span>
              </div>
              <div className="shortcut-item">
                <kbd>Esc</kbd>
                <span>Deselect current shape</span>
              </div>
            </div>
          </div>
          
          <div className="help-section tips">
            <h3>Pro Tips</h3>
            <ul>
              <li>Use the grid for precise measurements and alignment</li>
              <li>Adjust properties numerically in the properties panel for accuracy</li>
              <li>Save your work frequently using the Export function</li>
              <li>Rotate shapes while holding Shift for 15° increments</li>
            </ul>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="got-it-button" onClick={onClose}>
            Got it, let's start planning!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;