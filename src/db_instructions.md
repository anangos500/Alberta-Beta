# Menambahkan bypass verifikasi Email di Supabase
Supabase melarang bypass verifikasi email langsung dari *client-side* (web ini) untuk alasan keamanan (hanya bisa jika menggunakan Service Role Key di server).

Namun ada **dua cara** untuk membuatnya langsung terverifikasi:

**Cara 1 (Paling Mudah): Lewat Dashboard Supabase**
1. Buka dashboard Supabase.
2. Masuk ke menu **Authentication** -> **Providers** -> **Email**.
3. Matikan toggle **Confirm email**.
4. Simpan (Save).

**Cara 2: Menggunakan SQL Trigger**
Jika Anda ingin tetap menyalakan "Confirm email" namun ingin akun yang dibuat oleh web ini langsung terverifikasi otomatis, Anda bisa menjalankan *trigger* SQL ini di menu **SQL Editor** Supabase:

```sql
CREATE OR REPLACE FUNCTION auto_confirm_user_email()
RETURNS trigger AS $$
BEGIN
  -- Set email_confirmed_at to current timestamp
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_auto_confirm ON auth.users;

CREATE TRIGGER on_auth_user_created_auto_confirm
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION auto_confirm_user_email();
```
Saya juga sudah menambahkan script SQL di atas ke dalam file `supabase_schema.sql`.
