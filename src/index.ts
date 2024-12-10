abstract class Ability {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract apply(attacker: Character, defender: Character): void;
}

class HalfDamage extends Ability {
  constructor() {
    super("HALF_DAMAGE");
  }

  apply(attacker: Character, defender: Character): void {
    if (Math.random() < 0.25) {
      console.log(`${defender.name} activates HALF_DAMAGE`);
      defender.isHalfDamage = true;
    } else {
      console.log(`${defender.name} did not activate HALF_DAMAGE`);
    }
  }
}

class BoostAttack extends Ability {
  constructor() {
    super("BOOST_ATTACK");
  }

  apply(attacker: Character, defender: Character): void {
    if (Math.random() < 0.25) {
      console.log(`${attacker.name} activates BOOST_ATTACK`);
      attacker.isBoostAttack = true;
    } else {
      console.log(`${attacker.name} did not activate BOOST_ATTACK`);
    }
  }
}

class SelfHeal extends Ability {
  constructor() {
    super("SELF_HEAL");
  }

  apply(attacker: Character, defender: Character): void {
    if (defender.health < 30 && Math.random() < 0.25) {
      defender.heal(5);
      console.log(`${defender.name} activates SELF_HEAL`);
    }
  }
}

class Character {
  name: string;
  health: number;
  attackPower: number;
  defensePower: number;
  ability: Ability;
  isHalfDamage: boolean;
  isBoostAttack: boolean;

  constructor(name: string, ability: Ability) {
    this.name = name;
    this.health = 100;
    this.attackPower = getRandomNumber(15, 20);
    this.defensePower = getRandomNumber(10, 15);
    this.ability = ability;
    this.isHalfDamage = false;
    this.isBoostAttack = false;
  }

  takeDamage(damage: number): void {
    let effectiveDamage = damage;
    if (this.isHalfDamage) {
      effectiveDamage = Math.floor(damage / 2);
      this.isHalfDamage = false;
    }
    effectiveDamage = Math.max(effectiveDamage - this.defensePower, 0);
    this.health -= effectiveDamage;
    console.log(`${this.name} takes ${effectiveDamage} damage, health is now ${this.health}`);
  }

  heal(amount: number): void {
    this.health += amount;
    console.log(`${this.name} heals ${amount} points, health is now ${this.health}`);
  }

  resetRoundEffects(): void {
    this.isHalfDamage = false;
    this.isBoostAttack = false;
  }
}

const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandomAbility = (): Ability => {
  const abilities = [new HalfDamage(), new BoostAttack(), new SelfHeal()];
  return abilities[Math.floor(Math.random() * abilities.length)];
};

const simulateDuel = () => {
  const character1 = new Character("Character 1", getRandomAbility());
  const character2 = new Character("Character 2", getRandomAbility());

  console.log(`${character1.name}: power = ${character1.attackPower}, defense = ${character1.defensePower}`);
  console.log(`${character2.name}: power = ${character2.attackPower}, defense = ${character2.defensePower}`);

  let attacker = Math.random() < 0.5 ? character1 : character2;
  let defender = attacker === character1 ? character2 : character1;

  let round = 1;
  while (character1.health > 0 && character2.health > 0) {
    console.log(`\nRound ${round}:`);
    console.log(`${attacker.name} attacks`);

    if (attacker.ability instanceof BoostAttack) {
      attacker.ability.apply(attacker, defender);
    }

    if (defender.ability instanceof HalfDamage) {
      defender.ability.apply(attacker, defender);
    }

    const attackPower = attacker.isBoostAttack ? Math.floor(attacker.attackPower * 1.5) : attacker.attackPower;
    defender.takeDamage(attackPower);

    if (defender.ability instanceof SelfHeal) {
      defender.ability.apply(attacker, defender);
    }

    if (defender.health <= 0) {
      console.log(`\n${attacker.name} won the duel!`);
      break;
    }

    attacker.resetRoundEffects();
    defender.resetRoundEffects();

    [attacker, defender] = [defender, attacker];
    round++;
  }
};

simulateDuel();
