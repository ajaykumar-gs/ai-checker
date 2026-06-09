export interface SampleText {
  id: string;
  label: string;
  category: "clearly-human" | "clearly-ai" | "mixed" | "paraphrased" | "short-edge-case";
  text: string;
}

export const SAMPLE_TEXTS: SampleText[] = [
  {
    id: "human-1",
    label: "Personal Essay (Human)",
    category: "clearly-human",
    text: `I remember the exact moment I decided to quit my corporate job. It was a Tuesday — which is somehow always worse than a Monday — and I was sitting in the third consecutive meeting that could have been an email. My coffee was cold. My chair was uncomfortable. And the guy presenting was using the phrase "synergistic alignment" unironically.

I had been there six years. I had a nice title and a nicer salary, and I kept telling myself that the discomfort was the price you paid for security. But somewhere around hour three of that meeting, something quietly snapped.

I didn't resign that day. I went home and ate leftovers standing over the kitchen sink, the way you do when you're too tired to even sit at a table. I watched pigeons on the fire escape. But over the next three weeks I did the math, figured out how long my savings would last, and eventually walked into my manager's office with a resignation letter I'd written and deleted eleven times.

That was four years ago. I've made about a third of what I made before. I've also slept better, fought less, and done actual work I give a damn about. I'm not saying it was smart. I'm not saying you should do it. I'm just saying that sometimes the cost of comfort is more expensive than you're accounting for.`,
  },
  {
    id: "ai-1",
    label: "Business Article (AI)",
    category: "clearly-ai",
    text: `In today's rapidly evolving business landscape, organizations must embrace digital transformation to remain competitive. Furthermore, the integration of artificial intelligence and machine learning technologies has become increasingly important for companies seeking to optimize their operations and enhance customer experiences.

It is worth noting that successful digital transformation requires a comprehensive strategic approach. Organizations must first assess their current technological capabilities and identify areas for improvement. Additionally, leadership buy-in is essential for driving meaningful change across all departments.

Moreover, data-driven decision-making has emerged as a critical competency for modern enterprises. By leveraging advanced analytics platforms, businesses can gain valuable insights into customer behavior, market trends, and operational efficiency. Consequently, companies that fail to adopt these technologies risk falling behind their more digitally sophisticated competitors.

In conclusion, the path to digital maturity is not without its challenges. Nevertheless, organizations that invest in robust technology infrastructure and cultivate a culture of innovation will be well-positioned to thrive in the digital economy. To summarize, digital transformation is no longer optional — it is an imperative for long-term business success.`,
  },
  {
    id: "mixed-1",
    label: "Blog Post (Mixed)",
    category: "mixed",
    text: `Last weekend I finally finished building the raised garden beds I've been putting off for two years. My knees hurt and I have three new blisters, but there's something genuinely satisfying about staring at a pile of lumber and thinking: I made that into a thing.

The process of constructing raised garden beds involves several key considerations. First, it is important to select the appropriate wood species, as rot resistance is a critical factor for longevity. Cedar and redwood are commonly recommended due to their natural durability and resistance to moisture-related decay. Additionally, the dimensions of the bed should be carefully planned to ensure accessibility from all sides without stepping into the planting area.

I mostly ignored all of that and bought whatever was cheapest at the hardware store. Pine, I think? I'll let you know in three years if it rots.

Fill material is also a significant consideration. A mixture of topsoil, compost, and a coarse amendment such as perlite or coarse sand promotes optimal drainage and aeration for root development. Many gardeners follow a "Mel's Mix" formula consisting of one-third compost, one-third peat moss or coconut coir, and one-third coarse vermiculite.

My mix was: whatever was in the yard, plus two bags of stuff from the garden center that smelled like mushrooms. We'll see.`,
  },
  {
    id: "paraphrased-1",
    label: "Paraphrased / Rewritten",
    category: "paraphrased",
    text: `Climate change represents one of the defining challenges of our time, requiring coordinated global action to address its far-reaching consequences. The scientific evidence is clear and unambiguous: human activities, particularly the burning of fossil fuels and deforestation, have led to a significant increase in atmospheric greenhouse gases, resulting in measurable warming of the Earth's surface.

The effects of this warming are being felt across every region of the globe. Extreme weather events have grown more frequent and intense, sea levels continue to rise, and ecosystems face increasing pressure from shifting temperature and precipitation patterns. Vulnerable communities, particularly in developing nations, bear a disproportionate burden of these impacts despite contributing least to the problem.

Addressing the climate crisis will require fundamental transformations in energy systems, land use, transportation, and industrial processes. Renewable energy technologies have advanced dramatically in recent years, making the transition to clean power increasingly economically viable. However, the scale and pace of deployment must accelerate substantially to meet the targets established by international climate agreements.

Individual actions, while meaningful, are insufficient on their own. Systemic change driven by robust policy frameworks, international cooperation, and significant investment in both mitigation and adaptation measures is essential to limiting warming to levels that avoid the most catastrophic outcomes.`,
  },
  {
    id: "short-edge",
    label: "Short Text (Edge Case)",
    category: "short-edge-case",
    text: `The meeting went longer than expected. We decided to table the budget discussion until Thursday.`,
  },
];
