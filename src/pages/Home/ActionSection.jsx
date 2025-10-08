import React from 'react'
import { Button } from '@/components/ui/button';
import { Link } from "react-router-dom";
function ActionSection() {
  return (
    <section className='Action_Section py-14 '>
<div className="container mx-auto p-6 w-[90%]  lg:w-full ">
<div className='flex flex-col items-center gap-1 '>
              <h2 className="text-3xl font-bold">Ready to Transform Your Career?</h2>
        <p className="text-muted-foreground py-4 text-center">Join our community today and get access to world-class learning resources, connect with professionals, and unlock new opportunities.</p>
<div>
    <Button className="bg-primary text-secondary hover:scale-102 transition-all mt-2 text-xl">
      <Link to="/register">Create Your Free Account</Link>
    </Button>
</div>
</div>
</div>
    </section>
  )
}

export default ActionSection