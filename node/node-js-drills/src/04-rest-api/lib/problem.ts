export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
}

export function createProblem(
  status: number,
  title: string,
  detail: string,
  instance?: string,
): ProblemDetail {
  return {
    type: `${status}`,
    title,
    status,
    detail,
    ...(instance ? { instance } : {}),
  };
}
