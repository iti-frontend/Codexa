import React from "react";
import { Button } from "@/components/ui/button";
import { communitiesList } from "@/Constants/Home-data";

function DescriptionCommunity() {
  return (
    <section id="community" className="py-14 bg-primary/10">
      <div className="container mx-auto p-6 w-[90%]  lg:w-full">
        <div className="text-center  mx-auto ">
          <h2 className="text-3xl font-bold">
            Join a Vibrant{" "}
            <span className="text-primary">Learning Community</span>
          </h2>
          <p className="text-muted-foreground py-4">
            Connect with developers and tech experts from around the world.
            Share insights through posts and blogs, engage in meaningful
            discussions, and build lasting professional relationships.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center py-4  ">
          <div className="rounded-[12px] overflow-hidden  transition-transform duration-150">
            <img
              src="/Home_Images/community.jpg"
              alt="community image"
              className="h-full object-fill hover:scale-101"
            />
          </div>
          <div>
            <div>
              <ul className="list-none py-2 flex flex-col gap-3">
                {communitiesList.map((community, index) => (
                  <li key={index} className="flex py-2 ">
                    <div className="bg-primary text-white h-fit p-2 me-2 rounded-full hover:bg-primary/20 hover:text-muted-foreground transition-all duration-200">
                      <community.icon />
                    </div>
                    <div>
                      <h3 className="text-[20px] font-medium">
                        {community.title}
                      </h3>
                      <p className="text-muted-foreground ">{community.desc}</p>
                    </div>
                  </li>
                ))}

                <li className="py-2 text-center lg:text-start ">
                  <Button className="mt-2 text-primary py-5 bg-white hover:bg-white text-xl border border-primary hover:scale-102 transition-all">
                    Join the Community
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DescriptionCommunity;
