sed -i -e '/setCurrentUser({/i \
            let studentIds: string[] = [];\
            if (data.role === "orang_tua") {\
              const { data: psData } = await supabase.from("parent_students").select("student_id").eq("parent_id", data.id);\
              if (psData) studentIds = psData.map(ps => ps.student_id);\
            }\
' src/context/AppContext.tsx
sed -i -e 's/foto: data.foto/foto: data.foto,\n              studentIds/' src/context/AppContext.tsx
