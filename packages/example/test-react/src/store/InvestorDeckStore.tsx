import { create } from 'zustand';

interface InvestorDeckSettings {
  // Branding
  companyName: string;
  tagline: string;
  industry: string;
  primaryColor: string;
  secondaryColor: string;
  // Capital raise
  askAmount: string;
  humanCapital: string;
  productRefinement: string;
  // Section visibility
  showProblem: boolean;
  showSolution: boolean;
  showMarket: boolean;
  showTeam: boolean;
  showGrowth: boolean;
  showClients: boolean;
  showCompetitors: boolean;
  showCapitalRaise: boolean;
  showVideo: boolean;
  // Image URLs (all customisable)
  imgSolutionDiagram: string;
  imgSoftwareFramework: string;
  imgTeam: string;
  imgAcquisition1: string;
  imgAcquisition2: string;
  imgAcquisition3: string;
  imgCompetitors: string;
  imgClients: string;
  imgCharts: string;
  imgCapitalRaise: string;
  // Video
  videoSrc: string;
  videoAutoplay: boolean;
  videoMuted: boolean;
  videoLoop: boolean;
  videoControls: boolean;
}

export const DEFAULTS: InvestorDeckSettings = {
  companyName: 'Nude Solutions',
  tagline: 'Empowering insurers and brokers to thrive in their dynamic market.',
  industry: 'Insurance Technology',
  primaryColor: '#009688',
  secondaryColor: '#1565C0',
  askAmount: '$6 million',
  humanCapital: '$5 million',
  productRefinement: '$1 million',
  showProblem: true,
  showSolution: true,
  showMarket: true,
  showTeam: true,
  showGrowth: true,
  showClients: true,
  showCompetitors: true,
  showCapitalRaise: true,
  showVideo: true,
  imgSolutionDiagram: '/page2-pic1.png',
  imgSoftwareFramework: '/page3-pic1.png',
  imgTeam: '/page5-pic1.png',
  imgAcquisition1: '/page6-pic1.png',
  imgAcquisition2: '/page6-pic2.png',
  imgAcquisition3: '/page6-pic3.png',
  imgCompetitors: '/page6-pic4.png',
  imgClients: '/page7-pic1.png',
  imgCharts: '/page8-pic1.png',
  imgCapitalRaise: '/page10-pic1.png',
  videoSrc: '/My video - Date.mp4',
  videoAutoplay: false,
  videoMuted: true,
  videoLoop: false,
  videoControls: true,
};

interface InvestorDeckState {
  settings: Record<string, InvestorDeckSettings>;
  get: (id: string) => InvestorDeckSettings;
  set: (id: string, patch: Partial<InvestorDeckSettings>) => void;
  clearComponent: (id: string) => void;
}

export const useInvestorDeckStore = create<InvestorDeckState>(
  (setState, getState) => ({
    settings: {},

    get: id => getState().settings[id] ?? { ...DEFAULTS },

    set: (id, patch) =>
      setState(state => ({
        settings: {
          ...state.settings,
          [id]: { ...(state.settings[id] ?? DEFAULTS), ...patch },
        },
      })),

    clearComponent: id =>
      setState(state => {
        const settings = { ...state.settings };
        delete settings[id];
        return { settings };
      }),
  })
);

document.addEventListener('pb:component-removed', (e: Event) => {
  const { componentId } = (e as CustomEvent<{ componentId: string }>).detail;
  useInvestorDeckStore.getState().clearComponent(componentId);
});
