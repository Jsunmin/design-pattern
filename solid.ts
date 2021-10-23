{
    // 1-S, SRP 원칙: 모듈 클래스 함수는 하나의 기능에 대한 책임만을 가져야 한다.
    // 독립적인 기능을 가진 2함수의 조합으로 쓰자!
    const add = (a:number, b:number) => (a + b);
    const print = (a: any) => {console.log(a)};

    // const addPrint = (a: number, b: number) {
    //     const add = a + b;
    //     console.log(add);
    // }
    const added = add(1,2);
    print(added);

    // 새에 관련한 기능과 프로퍼티만
    class Bird {
        constructor(private name: string, private age: number) {}

        eat(food: string) {}
        walk() {}
        fly() {}

        represent() {
            return `${this.name}, ${this.age}`;
        }
    }
    // 새와 관련 없는 기능 분리
    const log = (property: any) => { console.log(property) }
    // 상태를 나타내는 기능 (bird의 responsibilty) + log (logger의 respoonsibility) 분리
    log(new Bird('sparrow', 1).represent());
}

{
    // 2-O, open-closed 원칙: 확장에 대해서는 개방적 / 수정에 대해서는 폐쇄적
    // 상속, interface를 통한 변화를 장려!
    
    abstract class Animal {
        // 상속시 구현 강제
        abstract speak(): void
    }
    class Cat extends Animal {
        speak() { console.log('meaow') };
    }
    class Dog extends Animal {
        speak() { console.log('bark') };
    }
    // 확장에 대한 유연한 대처 가능!
    class Sheep extends Animal {
        speak() { console.log('meh') };
    }
    class Cow extends Animal {
        speak() { console.log('moo') };
    }
    // 수정을 최소화하면서 추가 기능 수행
    const hey = (animal: Animal) => animal.speak();

    hey(new Cat());
    hey(new Dog());
    // 신규 기능 추가 ~ 객체 추가 (확장) & 함수 기능변화 X (수정X)
    hey(new Sheep());
    hey(new Cow());
}

{
    // 3-L, 리스코프 치환원칙: 부모 객체를 자식 객체로 대체해도 프로그램은 작동해야 함
    // 자식 객체는 부모 객체의 기능을 모두 수행할 수 있어야 한다.
    class Cat {
        speak() { console.log('meaow') };
    }

    class BlackCat extends Cat {
        speak() { console.log('bleack meaow') };
    }
    class Fish extends Cat {
        speak() { throw new Error('can not speak!') };
    }

    const cat = new Cat();
    const blackCat = new BlackCat();
    const fish = new Fish();
    cat.speak();
    blackCat.speak(); // 부모 객체와 같은 기능을 수행하면서 대체 가능!

    // fish.speak(); // 부모 객체와 다르게 작동함.. 리스코프 치환원칙과 위배된다!
    // 그렇기 때문에, Cat에 이런 서브객체, 자식객체가 있으면 안됨! --> 설계 잘못됨!
}

{
    // 4-I, 인터페이스 분리 원칙: 큰 인터페이스를 작게 분리하는게 좋다.
    // 인터페이스: 설계의 규칙을 설정하는 것 ~ 이를 준수한 클래스를 만들어야 함!

    // 맨 처음부터 수륙양용 차를 위한 인터페이스를 설계하는 것이 아니라. 쪼개서 설계!
    interface ICar {
        drive(): void
        turnRight(): void
        turnLeft(): void
    }
    interface IBoat {
        steer(): void
        steerRight(): void
        steerLeft(): void
    }
    class Genesis implements ICar {
        drive() {}
        turnRight() {}
        turnLeft() {}
    }
    class Yoat implements IBoat {
        steer() {}
        steerRight() {}
        steerLeft() {}
    }
    class AmphibiousVehicle implements ICar, IBoat {
        // 두개의 분리된 인터페이스를 함께 구현하면서 더 큰 객체를 설계한다!
        drive() {}
        turnRight() {}
        turnLeft() {}
        steer() {}  
        steerRight() {}
        steerLeft() {}
    }
}

{
    // 5-D, 의존관계 역전(Inversion) 원칙: 소프트웨어 분리 형식 ~ 상위 계층이 하위 계층에 의존하는 관계 반전
    /**
     *  상위 계층이 하위 계층의 구현으로부터 독립되게 만드는 것!
     *   1. 상위 모듈은 하위모듈에 의존해서는 안된다.
     *   2. 추상화는 세부사항에 의존해서는 안된다. 세부사항이 추상화에 의존해야 한다.
     */ 

    // Anti Pattern
    class AntiZCat {
        speak() { console.log('meaow') };
    }
    class AntiZDog {
        speak() { console.log('bark') };
    }
    class AntiZoo {
        cat: AntiZCat
        dog: AntiZDog
        constructor() {
            this.cat = new AntiZCat();
            this.dog = new AntiZDog();
            // this.cow = new AntiZCow(); .. 상위 모듈의 수정 불가피..
        }
        /**
         * 동물원이 고양이와 강아지라는 하위 계층 모듈을 가지고 있는게 직관스러움!
         * 그러나 다른 하위 모듈들이 추가된다면, Zoo 상위 모듈은 코드 유지보수가 어려워짐..
         *  
         * -> 상위모듈과 하위모듈의 의존관계를 낮춤으로써 유지보수를 쉽게 함!
         */ 
    }

    // Dependency Inversion
    abstract class ZAnimal {
        abstract speak(): void;
    }
    class ZCat extends ZAnimal {
        speak() { console.log('meaow') };
    }
    class ZDog  extends ZAnimal {
        speak() { console.log('bark') };
    }
    class Zoo {
        constructor(private animals: ZAnimal[] = []) {}

        addAnimal(animal: ZAnimal) {
            this.animals.push(animal);
        }

        speakAll() {
            this.animals.forEach(a => { a.speak() });
        }
        /**
         * 동물원은 여기에 포함될 하위 모듈의 추상화 클래스인 ZAninal에만 의존관계를 갖으며.
         * 실제 하위모듈과는 직접적인 의존관계가 사라짐!
         *  
         * -> 상위모듈과 하위모듈의 의존관계를 낮춤으로써 유지보수를 쉽게 함!
         * 
         * Zoo -> cat, dog .. 
         *  => Zoo -> ZAnimal <- cat, dog
         *   ~ 하위 객체의 포함 관계 화살표 역전!
         */ 
    }
    
    const zoo = new Zoo();
    zoo.addAnimal(new ZCat());
    zoo.addAnimal(new ZDog());
    // 추후에 cow, sheep 등의 기능 확장이 일어나도, 상위객체 Zoo에 대한 수정은 필요없다!
    zoo.speakAll();
}