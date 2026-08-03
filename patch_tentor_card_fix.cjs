const fs = require('fs');
let code = fs.readFileSync('src/components/portal/AdminDashboard.tsx', 'utf8');

const startIndex = code.indexOf('<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">');
const endIndexStr = '{/* JADWAL */}';
const endIndex = code.indexOf(endIndexStr);

if (startIndex !== -1 && endIndex !== -1) {
  const before = code.substring(0, startIndex);
  // Find where the previous block ends by backtracking from '{/* JADWAL */}' to the closing tags
  const jadwalBlock = code.substring(endIndex);
  
  // Actually, let's just find the closing tags of the tentor tab.
  // It should be:
  //           </div>
  //         </div>
  //       )}
  
  const targetEndStr = `          </div>\n        </div>\n      )}\n\n      {/* JADWAL */}`;
  const targetEndIndex = code.indexOf(targetEndStr);
  
  if (targetEndIndex !== -1) {
    const after = code.substring(targetEndIndex);
    const newTentorList = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {tentors.map((t) => (
              <TentorCard
                key={t.id}
                tentor={t}
                onEdit={(tentor) => {
                  setEditingTentor(tentor);
                  setIsTentorModalOpen(true);
                }}
              />
            ))}
`;
    code = before + newTentorList + after;
    fs.writeFileSync('src/components/portal/AdminDashboard.tsx', code);
    console.log("Success");
  } else {
    console.log("Could not find the target end string");
  }

} else {
  console.log("Could not find start or end index");
}
