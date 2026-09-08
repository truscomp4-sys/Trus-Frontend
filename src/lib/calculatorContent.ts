// Copy for the wage calculator page. These defaults are exactly what the page
// ships with today: they render while the admin values load, and whenever the
// API is unreachable or the key has never been saved. The public component and
// the admin screen both import from here so the two cannot drift apart.
//
// The closing block on this page is the homepage CTA, so it is edited under
// Home Page Content rather than here.

export const CALCULATOR_CONTENT_KEY = "wage_calculator_page";

export interface CalculatorContent {
    badge: string;
    heading_prefix: string;
    heading_highlight: string;
    description: string;
    button_label: string;
    button_url: string;
}

export const DEFAULT_CALCULATOR_CONTENT: CalculatorContent = {
    badge: "Free Compliance Tool",
    heading_prefix: "Wage Impact",
    heading_highlight: "Calculator",
    description:
        "Plan and simulate the impact of the new wage codes on your organization with our specialized calculator.",
    button_label: "TrusComp Wage Code Calculator",
    button_url: "https://app.truscomp.com/WagecodeCalculator/wagecalculator",
};
