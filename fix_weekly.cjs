const fs = require('fs');
let code = fs.readFileSync('src/components/portal/WeeklyReportFormModal.tsx', 'utf8');
code = code.replace(/    \}\n    onClose\(\);\n  \};\n\n  return \(\n    <div className="fixed inset-0 z-50 bg-stone-900\/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-hidden">/, `    }
    onClose();
  };

  const handleClose = () => {
    let isDirty = false;
    
    if (editingReport) {
      if (
        selectedStudentId !== editingReport.studentId ||
        mingguKe !== editingReport.mingguKe ||
        tanggal !== editingReport.tanggalPembelajaran ||
        hari !== editingReport.hari ||
        mataPelajaran !== editingReport.mataPelajaran ||
        materi !== editingReport.materi ||
        JSON.stringify(ratings) !== JSON.stringify(editingReport.ratings) ||
        targetBerikutnya !== editingReport.targetBerikutnya ||
        saranTentor !== editingReport.saranTentor ||
        JSON.stringify(photos) !== JSON.stringify(editingReport.dokumentasiFoto || [])
      ) {
        isDirty = true;
      }
    } else {
      const defaultStudentId = preselectedStudent ? preselectedStudent.id : '';
      const defaultRatings = {
        pemahamanMateri: 'Sangat Baik',
        kemampuanSoal: 'Tepat dan Cepat',
        keaktifan: 'Sangat Aktif',
        kemandirian: 'Mandiri',
        interaksi: 'Sangat Baik',
        sikap: 'Sangat Disiplin',
        keterampilanCatat: 'Rapi dan Lengkap',
      };
      const defaultTanggal = new Date().toISOString().split('T')[0];
      if (
        selectedStudentId !== defaultStudentId ||
        mingguKe !== 4 ||
        tanggal !== defaultTanggal ||
        hari !== 'Selasa' ||
        mataPelajaran !== 'Matematika & IPA' ||
        materi !== '' ||
        JSON.stringify(ratings) !== JSON.stringify(defaultRatings) ||
        targetBerikutnya !== '' ||
        saranTentor !== '' ||
        photos.length > 0
      ) {
        isDirty = true;
      }
    }

    if (isDirty) {
      if (window.confirm('Ada data yang belum disimpan. Apakah Anda yakin ingin membuang data ini?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-hidden" onClick={handleClose}>`);
code = code.replace(/<div className="bg-white rounded-3xl max-w-3xl w-full shadow-sm border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-full">/, `<div className="bg-white rounded-3xl max-w-3xl w-full shadow-sm border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-full" onClick={(e) => e.stopPropagation()}>`);
fs.writeFileSync('src/components/portal/WeeklyReportFormModal.tsx', code);
