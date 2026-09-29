export async function getDomainInfo(domain) {
  const rdapResponse = await fetch(`https://rdap.org/domain/${domain}`, {
    headers: { "User-Agent": "Mozilla/5.0 (trustidy-app)" },
  });

  let domainAge = null;
  let registrarName = null;

  if (rdapResponse.ok) {
    const rdapData = await rdapResponse.json();
    console.log(
      "registration event:",
      rdapData.events?.find((e) => e.eventAction === "registration"),
    );

    const registrationEvent = rdapData.events?.find(
      (e) => e.eventAction === "registration",
    );

    if (registrationEvent) {
      const registeredDate = new Date(registrationEvent.eventDate);
      const ageMs = Date.now() - registeredDate.getTime();
      domainAge = Math.floor(ageMs / (1000 * 60 * 60 * 24 * 365));
    }

    const registrarEntity = rdapData.entities?.find((e) =>
      e.roles.includes("registrar"),
    );
    registrarName =
      registrarEntity?.vcardArray?.[1]?.find(
        (field) => field[0] === "fn",
      )?.[3] ?? null;
  }
  return { domainAge, registrarName };
}
