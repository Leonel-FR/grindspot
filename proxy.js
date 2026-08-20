import { auth } from "@/auth";
import { trackAICrawlerRequest } from "@datafast/ai-crawl";

export default auth((request, event) => {
  trackAICrawlerRequest(request, event, {
    websiteId: "dfid_Db0mcaFtGlQOhXaes5qBT",
  });
});
