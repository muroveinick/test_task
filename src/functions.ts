export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const compareObjects = (verifiable_obj: any, mask_obj: any, soft_comparation = true) => {
  if (!verifiable_obj || !mask_obj) {
    return false;
  }

  let final_decision = true;
  for (const key in mask_obj) {
    if (key in verifiable_obj) {
      final_decision &&= verifiable_obj[key] === mask_obj[key];
    } else if (!soft_comparation) {
      final_decision = false;
    }

    if (!final_decision) {
      return false;
    }
  }
  return final_decision;
};
