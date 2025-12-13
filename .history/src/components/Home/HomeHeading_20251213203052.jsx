
import { useTranslation } from "react-i18next";

function HomeHeading({ title, desc, titleKey, descKey }) {
  const { t } = useTranslation();

  return (
    <div className="text-center space-y-3 mb-12">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
        {titleKey ? t(titleKey) : title}
      </h2>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
        {descKey ? t(descKey) : desc}
      </p>
    </div>
  );
}

export default HomeHeading;