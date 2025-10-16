import { featuresData } from "@/Constants/Home-data";
import HomeHeading from "./HomeHeading";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

function HomeFeatures() {
  return (
    <section className="flex flex-col items-center justify-center py-10 border-y">
      <HomeHeading
        title="Why Choose Codexa ?"
        desc="Codexa offers a unique blend of learning and teaching, fostering a collaborative environment for growth"
      />
      <main className="flex flex-col md:flex-row items-center justify-center flex-wrap gap-8 mt-5">
        {featuresData.map((feature, index) => (
          <FeaturesCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </main>
    </section>
  );
}

export default HomeFeatures;

function FeaturesCard({ icon: Icon, title, description }) {
  return (
    <Card className="max-w-xs gap-2 shadow-lg rounded-2xl">
      <CardHeader className="">
        <div className="bg-primary p-3 w-fit rounded-full text-white shadow shadow-primary">
          <Icon size={20} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <h3 className="text-xl font-bold text-card-foreground">{title}</h3>
        <p className="text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
    </Card>
  );
}
