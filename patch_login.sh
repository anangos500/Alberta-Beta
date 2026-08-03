sed -i -e '/setCurrentUser({/i \
      let studentIds: string[] = [];\
      if (profile.role === "orang_tua") {\
        const { data: psData } = await supabase.from("parent_students").select("student_id").eq("parent_id", profile.id);\
        if (psData) studentIds = psData.map(ps => ps.student_id);\
      }\
' src/components/public/LoginModal.tsx
sed -i -e 's/foto: profile.foto/foto: profile.foto,\n        studentIds/' src/components/public/LoginModal.tsx
