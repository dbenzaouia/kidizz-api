function buildAvatarUrl(
  context: string,
  prenom: string | null | undefined,
  nom: string | null | undefined,
): string {
  if (context.includes('default')) {
    return '';
  }

  const initialPrenom = prenom ? prenom.charAt(0).toUpperCase() : '';
  const initialNom = nom ? nom.charAt(0).toUpperCase() : '';

  return `https://ui-avatars.com/api/?name=${initialPrenom}+${initialNom}`;
}
