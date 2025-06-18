import { Button } from "@/components/ui/button";
export default function Navbar() {
  return (
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Estate Run</h1>
            <div className="flex items-center gap-4">
              <a href="/signup">
                <Button variant="outline">Sign Up</Button>
              </a>
              <a href="/login">
                <Button>Login</Button>
              </a>
            </div>
          </div>
        </div>
      </header>
  );
}
