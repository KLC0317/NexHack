export interface MCPRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params: any;
}

export interface MCPResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export function createMCPResponse(id: string | number, result: any): MCPResponse {
  return {
    jsonrpc: "2.0",
    id,
    result,
  };
}

export function createMCPError(id: string | number, code: number, message: string, data?: any): MCPResponse {
  return {
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message,
      data,
    },
  };
}
