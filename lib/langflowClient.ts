"use client";

const FLOW_ID = "1c60f234-8a18-4f7d-ba8d-7d5c822c3d53";
const LANGFLOW_ID = "66aa2308-df7d-4d05-89cc-5e2ab18821e2";

export class LangflowClient {
  private async post(endpoint: string, data: any) {
    try {
      const response = await fetch('/api/langflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint,
          data
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Request Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to connect to Langflow API: ${errorMessage}`);
    }
  }

  async processInventory(inputValue: string) {
    const tweaks = {
      "ChatInput-DfZ2I": {},
      "ParseData-gpATK": {},
      "Prompt-vlluV": {},
      "SplitText-Hy7L5": {},
      "ChatOutput-OQeJQ": {},
      "AstraDB-2DhNn": {},
      "AstraDB-oe2Wd": {},
      "File-HVtmO": {},
      "Google Generative AI Embeddings-CHBYt": {},
      "Google Generative AI Embeddings-Tsxut": {},
      "GoogleGenerativeAIModel-g2Ryc": {}
    };

    const endpoint = `/lf/${LANGFLOW_ID}/api/v1/run/${FLOW_ID}?stream=false`;
    const body = {
      input_value: inputValue,
      input_type: 'chat',
      output_type: 'chat',
      tweaks
    };

    try {
      const response = await this.post(endpoint, body);
      console.log('Client Response:', response);

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.outputs?.[0]?.outputs?.[0]?.outputs?.message?.text) {
        throw new Error('Invalid response format from Langflow');
      }

      return response.outputs[0].outputs[0].outputs.message.text;
    } catch (error) {
      console.error('Error processing inventory:', error);
      throw error;
    }
  }
}

export const langflowClient = new LangflowClient();