/**
 * Manage organiser accounts from the terminal (bootstraps the first admins).
 *
 *   npm run admin -- add someone@example.com "Full Name"
 *   npm run admin -- reset someone@example.com      (back to the temporary password)
 *   npm run admin -- remove someone@example.com
 *   npm run admin -- list
 *
 * New and reset accounts get ADMIN_INITIAL_PASSWORD; setting their own password is optional.
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { hashPassword, initialPassword } from "../lib/admin/password";

const url = process.env.DATABASE_URL?.trim().replace(/^['"]|['"]$/g, "");
if (!url) throw new Error("DATABASE_URL is not set (.env)");
const sql = neon(url);

const [cmd, rawEmail, ...nameParts] = process.argv.slice(2);
const email = rawEmail?.trim().toLowerCase();

async function main() {
  switch (cmd) {
    case "add": {
      if (!email || !email.includes("@")) throw new Error('Usage: npm run admin -- add email "Full Name"');
      const name = nameParts.join(" ").trim() || email.split("@")[0];
      const hash = await hashPassword(initialPassword());
      const rows = await sql`
        insert into admins (email, name, password_hash, must_change_password)
        values (${email}, ${name}, ${hash}, true)
        on conflict (email) do nothing
        returning email`;
      console.log(rows.length ? `Added ${email} (${name}). They sign in with the temporary password.` : `${email} already has access.`);
      break;
    }
    case "reset": {
      const hash = await hashPassword(initialPassword());
      const rows = await sql`update admins set password_hash = ${hash}, must_change_password = true where email = ${email} returning id`;
      if (!rows.length) throw new Error(`No admin with email ${email}`);
      await sql`delete from admin_sessions where admin_id = ${rows[0].id}`;
      console.log(`Reset ${email} to the temporary password and signed them out everywhere.`);
      break;
    }
    case "remove": {
      const rows = await sql`delete from admins where email = ${email} returning email`;
      console.log(rows.length ? `Removed ${email}.` : `No admin with email ${email}.`);
      break;
    }
    case "list": {
      const rows = await sql`select email, name, must_change_password, last_login_at from admins order by created_at`;
      console.table(rows);
      break;
    }
    default:
      console.log("Commands: add <email> <name> | reset <email> | remove <email> | list");
  }
}

main().catch((e) => {
  console.error(String(e.message ?? e));
  process.exit(1);
});
