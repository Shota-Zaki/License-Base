export interface ApiClientOptions {
  baseUrl: string;
  fetcher?: typeof fetch;
}

export function createApiClient(options: ApiClientOptions) {
  const fetcher = options.fetcher ?? fetch;

  return {
    async getHealth() {
      const response = await fetcher(`${options.baseUrl}/v1/health`);
      if (!response.ok) throw new Error('Failed to fetch health.');
      return response.json();
    },
    async getSampleQuestion() {
      const response = await fetcher(`${options.baseUrl}/v1/questions/sample`);
      if (!response.ok) throw new Error('Failed to fetch sample question.');
      return response.json();
    }
  };
}
