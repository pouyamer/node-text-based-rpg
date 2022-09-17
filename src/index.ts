const DODGE_CHANCE = 0.02
const MISS_CHANCE = 0.01

class Character {
  name?: string

  base_ATK: number
  base_DEF: number
  base_HP: number

  LV: number

  // ATK and DEF are generated based on base_DEF and base_ATK in updateStatsBasedOnLevel()
  ATK?: number
  DEF?: number
  /*
    Health: When reaches ZERO character would be defeated
    Protection: when it reaches ZERO character starts losing health
  */
  MaxHP?: number
  MaxPT?: number // Protection is a percentage of health based on the role (tank: .5, sup: .6, atk: .4)

  // current health and protection
  HP?: number
  PT?: number

  showStats = () => {
    console.log(this.name)
    console.log(`HP: ${this.HP}/${this.MaxHP}     PT: ${this.PT}/${this.MaxPT}`)
    console.log(`ATK: ${this.ATK}   DEF: ${this.DEF}`)
    console.log("--------------------------------")
  }

  updateStatsBasedOnLevel = () => {
    this.ATK = Math.floor(this.base_ATK * (1 + 0.3 * (this.LV - 1)))
    this.DEF = Math.floor(this.base_DEF * (1 + 0.3 * (this.LV - 1)))

    this.MaxHP = Math.floor(this.base_HP * (1 + 0.3 * (this.LV - 1)))
    this.MaxPT = Math.floor(this.MaxHP * 0.4)

    // each time level updates health and protection refills
    this.HP = this.MaxHP
    this.PT = this.MaxPT
  }

  levelUp = () => {
    this.LV++
    console.log(`Leveled Up!, level ${this.LV}`)
    this.updateStatsBasedOnLevel()
  }

  attack = (character: Character) => {
    const attackingATK: number = this.ATK ?? 1
    const defendingDEF: number = character.DEF ?? 0

    const damage: number = Math.floor(
      (attackingATK * attackingATK) / (attackingATK * defendingDEF)
    )

    character.loseHealth(damage)
  }

  loseHealth = (amount: number) => {
    let playerHP = this.HP ?? 1
    let playerPT = this.PT ?? 0

    playerPT = playerPT - amount // if damage is greater than protection then it becomes negative

    /* Example:
    damage 10 to {HP : 10, PT : 5}
    then PT becomes 5 - 10 = -5
    then PT becomes zero

    HP becomes 10 + (-5) = 5

    final result: {HP : 5, PT : 0}

    */

    if (playerPT < 0) {
      this.PT = 0
      this.HP = playerHP + playerPT < 0 ? 0 : playerHP + playerPT
    } else {
      this.PT = playerPT
    }
  }
  constructor(
    name: string,
    base_HP: number,
    base_ATK: number,
    base_DEF: number,
    LV: number = 1
  ) {
    this.name = name ?? "{Default Character Name}"
    this.base_ATK = base_ATK
    this.base_DEF = base_DEF
    this.base_HP = base_HP
    this.LV = LV

    this.updateStatsBasedOnLevel()
  }
}

const p1 = new Character("Dave", 30, 2, 3, 2)
p1.showStats()

const enemy = new Character("Goblin", 5, 1, 1, 2)
enemy.showStats()

p1.attack(enemy)

enemy.showStats()
