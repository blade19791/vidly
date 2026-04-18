export function validateCustomer(req, res, next) {
  let { name, isGold, phone } = req.body;

  // name
  if (typeof name !== "string" || name.trim().length <= 3) {
    return res.status(400).send("Invalid name");
  }

  req.body.name = name.trim();

  // isGold
  if (typeof isGold === "string") {
    if (isGold.toLowerCase() === "true") isGold = true;
    else if (isGold.toLowerCase() === "false") isGold = false;
    else return res.status(400).send("Invalid isGold");
  }

  if (typeof isGold !== "boolean") {
    return res.status(400).send("isGold must be boolean");
  }

  req.body.isGold = isGold;

  // phone
  if (phone && typeof phone !== "string") {
    return res.status(400).send("Invalid phone");
  }
  if (phone) req.body.phone = phone.trim();

  next();
}
