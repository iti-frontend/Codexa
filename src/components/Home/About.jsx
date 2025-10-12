import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { illustrationList } from "@/Constants/Home-data";

function About() {
  return (
    <section id="about" className="py-14">
      <div className="container mx-auto p-6 w-[90%]  lg:w-full">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Everything You Need to Succeed</h2>
          <p className="text-muted-foreground py-4">
            Our platform combines learning, networking, and career opportunities
            in one seamless experience.
          </p>
        </div>
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6 py-4 ">
          {illustrationList.map((ele, index) => (
            <Card
              key={index}
              className="border border-gray-300  hover:scale-103 transition-all text-center md:text-start "
            >
              <CardHeader className="flex flex-col items-center md:items-start">
                <div className=" bg-primary p-2 text-white  w-max rounded-full hover:bg-primary/20 hover:text-muted-foreground transition-all duration-200">
                  <ele.icon size={22} />
                </div>
                <CardTitle className="font-medium">{ele.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{ele.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
