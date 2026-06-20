import type { Request, Response } from "express";
declare const getPeople: (req: Request, res: Response) => void;
declare const getPerson: (req: Request, res: Response) => Response<any, Record<string, any>>;
declare const createPersonPostman: (req: Request, res: Response) => Response<any, Record<string, any>>;
declare const updatePerson: (req: Request, res: Response) => Response<any, Record<string, any>>;
declare const deletePerson: (req: Request, res: Response) => Response<any, Record<string, any>>;
export { getPeople, getPerson, createPersonPostman, updatePerson, deletePerson };
//# sourceMappingURL=people.d.ts.map