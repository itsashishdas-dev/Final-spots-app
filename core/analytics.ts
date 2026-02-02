
export const analytics = {
  logEvent: (event: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${event}`, data);
    }
  },
  logError: (error: any, context?: string) => {
    console.error(`[Analytics Error] ${context || ''}`, error);
  },
  logScreenView: (screenName: string) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[View] ${screenName}`);
    }
  }
};
