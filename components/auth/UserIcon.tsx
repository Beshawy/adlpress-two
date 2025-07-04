import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const UserIcon = ({ color = "primary" }: { color?: string }) => {
  const router = useRouter();
  return (
<span className="relative inline-block -translate-x-1">
  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
      h-10 w-10 bg-yellow-100 rounded-full opacity-0 
      group-hover:opacity-100 transition-opacity duration-200">
  </span>
  <div className="relative z-10 group">
    <User
      onClick={() => router.push('/account')}
      className={`h-8 w-8 text-${color} cursor-pointer transition-colors duration-200 group-hover:text-yellow-500`}
    />
  </div>
</span>
  );
};

export default UserIcon; 