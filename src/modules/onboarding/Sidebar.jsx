// import { useState } from "react";
// import { PanelLeft, Plus, MessageSquare, Trash2, Edit2 } from "lucide-react";

// export default function Sidebar({ logs, onSelectLog, onDeleteLog, onNewLog }) {
//   const [isOpen, setIsOpen] = useState(true);
//   const [hoveredIndex, setHoveredIndex] = useState(null);

//   return (
//     <>
//       {/* Toggle Button when sidebar is closed */}
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 shadow"
//         >
//           <PanelLeft className="w-5 h-5 text-gray-700" />
//         </button>
//       )}

//       {/* Sidebar Backdrop for Mobile */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/20 z-30 lg:hidden"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 h-full bg-[#171717] text-white flex flex-col transition-all duration-300 z-40 ${
//           isOpen ? "w-64" : "w-0"
//         } overflow-hidden`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-3 border-b border-white/10">
//           <button
//             onClick={() => setIsOpen(false)}
//             className="p-1.5 rounded-lg hover:bg-white/10 transition"
//           >
//             <PanelLeft className="w-5 h-5" />
//           </button>

//           <button
//             onClick={() => onNewLog?.()}
//             className="p-1.5 rounded-lg hover:bg-white/10 transition"
//           >
//             <Edit2 className="w-5 h-5" />
//           </button>
//         </div>

//         {/* New Log Button */}
//         <div className="p-3">
//           <button
//             onClick={() => onNewLog?.()}
//             className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
//           >
//             <Plus className="w-5 h-5" />
//             <span className="font-medium">New Symptom Log</span>
//           </button>
//         </div>

//         {/* Logs List */}
//         <div className="flex-1 overflow-y-auto px-3 pb-3">
//           <div className="text-xs font-semibold text-gray-400 mb-2 px-3">
//             Recent Logs
//           </div>

//           {logs.length === 0 ? (
//             <div className="text-center py-8 px-4">
//               <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-600" />
//               <p className="text-sm text-gray-400">No logs yet</p>
//               <p className="text-xs text-gray-500 mt-1">
//                 Start a new symptom log to begin
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-1">
//               {logs.map((log, index) => (
//                 <div
//                   key={index}
//                   className="relative group"
//                   onMouseEnter={() => setHoveredIndex(index)}
//                   onMouseLeave={() => setHoveredIndex(null)}
//                 >
//                   <button
//                     onClick={() => onSelectLog?.(index)}
//                     className="w-full text-left p-3 rounded-lg hover:bg-white/10 flex items-start gap-3"
//                   >
//                     <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm truncate">
//                         {log.symptom.slice(0, 40)}
//                         {log.symptom.length > 40 ? "..." : ""}
//                       </p>
//                       <p className="text-xs text-gray-400 mt-1">
//                         Severity: {log.severity}/10
//                       </p>
//                     </div>
//                   </button>

//                   {/* Delete Button */}
//                   {hoveredIndex === index && (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onDeleteLog?.(index);
//                       }}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all"
//                     >
//                       <Trash2 className="w-4 h-4 text-red-400" />
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="border-t border-white/10 p-3 text-xs text-gray-400 px-3">
//           DoseWise
//         </div>
//       </div>

//       {/* Push main content padding */}
//       {isOpen && <div className="w-64 flex-shrink-0" />}
//     </>
//   );
// }

import { useState } from "react";
import { PanelLeft, Plus, MessageSquare, Trash2, Edit2 } from "lucide-react";

export default function Sidebar({
  messages,
  onSelectLog,
  onDeleteLog,
  onNewChat,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Only user messages (logs)
  const userLogs = messages
    .map((msg, index) => ({ msg, index }))
    .filter(({ msg }) => msg.role === "user");

  return (
    <>
      {/* Toggle button when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border hover:bg-gray-50 shadow"
          aria-label="Open sidebar"
        >
          <PanelLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#171717] text-white flex flex-col transition-all duration-300 z-40 ${
          isOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition"
            aria-label="Close sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              onNewChat?.();
              onSelectLog?.(null);
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition"
            aria-label="New chat"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>

        {/* New Log Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat?.();
              onSelectLog?.(null);
            }}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Symptom Log</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <div className="text-xs font-semibold text-gray-400 mb-2 px-3">
            Recent Logs
          </div>

          {userLogs.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p className="text-sm text-gray-400">No logs yet</p>
              <p className="text-xs text-gray-500 mt-1">
                Start a new symptom log to begin
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {userLogs.map(({ msg, index }) => (
                <div
                  key={index}
                  className="relative group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <button
                    onClick={() => onSelectLog?.(index)}
                    className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-all flex flex-col"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-sm truncate">
                        {msg.content.slice(0, 40)}
                        {msg.content.length > 40 ? "..." : ""}
                      </p>
                      {msg.timestamp && (
                        <span className="text-xs text-gray-400 ml-2">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Delete button on hover */}
                  {hoveredIndex === index && onDeleteLog && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteLog(index);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Delete log"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-3 text-xs text-gray-400 px-3">
          Dosewise
        </div>
      </div>

      {/* Sidebar placeholder for layout */}
      {isOpen && <div className="w-64 flex-shrink-0" />}
    </>
  );
}
