import { communityData } from "@/Constants/Home-data";
import HomeHeading from "./HomeHeading";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

function HomeCommunity() {
    return (
        <section
            className="flex flex-col items-center justify-center py-16 bg-muted/30"
            id="community"
        >
            <HomeHeading
                title="Join Our Thriving Community"
                desc="Connect with thousands of learners and educators. Share knowledge, ask questions, and grow together."
            />
            <main className="flex flex-col md:flex-row items-center justify-center flex-wrap gap-8 mt-5">
                {communityData.map((item, index) => (
                    <CommunityCard
                        key={index}
                        icon={item.icon}
                        title={item.title}
                        description={item.description}
                    />
                ))}
            </main>
        </section>
    );
}

export default HomeCommunity;

function CommunityCard({ icon: Icon, title, description }) {
    return (
        <Card className="max-w-xs gap-2 shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
            <CardHeader>
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
