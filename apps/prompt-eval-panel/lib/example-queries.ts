import { TestQuery } from "./types/testing.types";

export const exampleQueries: TestQuery[] = [
  {
    id: "chem-query-1",
    query: "What are the office hours for Dr. Paul Hooker in Chemistry 103?",
    expectedDocumentId: "c33ddcf0-e673-4e75-9250-14ea6b0eec45",
    enabled: true,
  },
  {
    id: "chem-query-2",
    query:
      "What is the difference between an endothermic and exothermic reaction according to the course materials?",
    expectedDocumentId: "2e4f3713-300d-4973-bc5c-b2b1b50b86b2",
    enabled: true,
  },
  {
    id: "chem-query-3",
    query:
      "What are the three assumptions about ideal gasses according to the course materials?",
    expectedDocumentId: "69736d70-cfe2-46b9-bfff-11871c2a4367",
    enabled: true,
  },
  {
    id: "chem-query-4",
    query:
      "What is the molecular geometry for H₂O according to the course materials?",
    expectedDocumentId: "8c49039b-3869-43ee-b335-832a5c3581a9",
    enabled: true,
  },
  {
    id: "chem-query-5",
    query:
      "What are the common exceptions to the octet rule according to the course materials?",
    expectedDocumentId: "d61cb875-ebb3-444d-9193-4531960832bd",
    enabled: true,
  },
  {
    id: "chem-query-6",
    query:
      "Summarize the key points of the reaction between zinc and iodine according to the course materials.",
    expectedDocumentId: "5379e3cc-7e95-4458-97fd-859c99e7d848",
    enabled: false,
  },
  {
    id: "chem-query-7",
    query:
      "What is the relationship between mass, volume, and density of a substance according to the course materials?",
    expectedDocumentId: "a359c0a9-5d20-4e48-8a7c-9d6da9ae161e",
    enabled: false,
  },
  {
    id: "chem-query-8",
    query:
      "What are the four types of chemical reactions described in Module 3?",
    expectedDocumentId: "4b6452ae-141d-4070-83bc-1d49ec2c337e",
    enabled: false,
  },
  {
    id: "chem-query-9",
    query:
      "According to the '103 M7b Nature of Energy (2).pdf' document, what is the DeBroglie relationship?",
    expectedDocumentId: "83a94af2-2ebc-4af6-a076-407f57f6759f",
    enabled: false,
  },
  {
    id: "chem-query-10",
    query:
      "In '103 M4a Stoich, Lim Reagent, Emp Form.pdf', how is the theoretical yield of a product calculated?",
    expectedDocumentId: "061f17ab-24c8-4d98-ab8b-96b79600dfe1",
    enabled: false,
  },
];
