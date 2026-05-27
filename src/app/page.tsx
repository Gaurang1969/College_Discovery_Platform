import { redirect } from "next/navigation";

export default function Home() {
  // Immediately redirect to the main listing page
  redirect("/colleges");
}