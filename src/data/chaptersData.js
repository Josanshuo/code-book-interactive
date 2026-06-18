// Official companion site by the author, Charles Petzold. These are his own
// interactive (HTML5 canvas) versions of the book's circuit diagrams. Keyed by
// our chapter number; only chapters he actually published a page for are listed.
// Verified against https://www.codehiddenlanguage.com (June 2026).
const COMPANION_BASE = 'https://www.codehiddenlanguage.com';
const COMPANION_LINKS = {
  6:  [{ label: 'Interactive circuits', url: `${COMPANION_BASE}/Chapter06` }],
  8:  [{ label: 'Interactive circuits', url: `${COMPANION_BASE}/Chapter08` }],
  10: [{ label: 'Interactive demo', url: `${COMPANION_BASE}/Chapter10` }],
  14: [{ label: 'Interactive circuits', url: `${COMPANION_BASE}/Chapter14` }],
  15: [{ label: 'Interactive circuits', url: `${COMPANION_BASE}/Chapter15` }],
  16: [{ label: 'Interactive circuits', url: `${COMPANION_BASE}/Chapter16` }],
  17: [{ label: 'Interactive circuits', url: `${COMPANION_BASE}/Chapter17` }],
  18: [{ label: 'Interactive circuits', url: `${COMPANION_BASE}/Chapter18` }],
  19: [{ label: 'Interactive circuits', url: `${COMPANION_BASE}/Chapter19` }],
  20: [{ label: 'Interactive circuits', url: `${COMPANION_BASE}/Chapter20` }],
  21: [{ label: 'Interactive circuits', url: `${COMPANION_BASE}/Chapter21` }],
  22: [{ label: 'Interactive circuits', url: `${COMPANION_BASE}/Chapter22` }],
  23: [{ label: 'Interactive circuits', url: `${COMPANION_BASE}/Chapter23` }],
  24: [{ label: 'Interactive CPU', url: `${COMPANION_BASE}/Chapter24` }],
  27: [
    { label: 'Assembly Language', url: `${COMPANION_BASE}/Chapter27a` },
    { label: 'JavaScript', url: `${COMPANION_BASE}/Chapter27b` },
  ],
};

const RAW_CHAPTERS = [
  {
    num: 1,
    title: "Best Friends",
    summary: "Two ten-year-olds living across the street want to communicate at night. They use flashlights. To do this, they need a code—a system of signals that stands for something else. This chapter introduces Morse code, where combinations of short (dots) and long (dashes) light flashes represent letters of the alphabet.",
    challenge: "Transmit the Morse code for the word 'HI' using the flashlight. 'H' is four dots (....) and 'I' is two dots (..). Use short taps for dots and slightly longer holds for dashes.",
    hint: "Click the flashlight button quickly 4 times (for H), wait a moment for the letter to complete, then click quickly 2 times (for I)."
  },
  {
    num: 2,
    title: "Codes and Combinations",
    summary: "How many letters can we represent with a certain number of signals? This chapter explores combinatorics. With 1 flash (binary: on/off), we can represent 2 things. With 2, we can represent 4. With 3, we can represent 8. The formula is 2^n. We visualize this using binary tree paths.",
    challenge: "Adjust the bit depth to 5. Look at the total combinations generated. Enter the total number of combinations possible with 5 bits to complete the challenge.",
    hint: "Move the slider or click the buttons to set the bit depth to 5. Check the combinations count at the bottom."
  },
  {
    num: 3,
    title: "Braille and Binary Codes",
    summary: "Louis Braille's system for the blind uses a grid of 6 dots (3x2). Each dot can be flat or raised (binary: 0 or 1). This yields 2^6 = 64 possible combinations, enough for all letters, numbers, and punctuation. It is one of the earliest successful binary code systems.",
    challenge: "Build the Braille representation of the letter 'C'. In standard Braille, 'C' is represented by raising the top two dots (Dot 1 and Dot 4).",
    hint: "Click the top-left dot (Dot 1) and the top-right dot (Dot 4) so they glow. Leave the others off."
  },
  {
    num: 4,
    title: "Anatomy of a Flashlight",
    summary: "A flashlight is a simple electrical circuit. A battery (voltage source), copper wire (conductor), a bulb (resistance that glows), and a switch (controls the path). A closed circuit allows electrons to flow; an open circuit stops them. We examine how switches create logic gates.",
    challenge: "Close the switch to complete the circuit, allowing electrons to flow and lighting the bulb.",
    hint: "Click the switch in the circuit diagram to toggle it to the CLOSED (ON) position."
  },
  {
    num: 5,
    title: "Communicating Around Corners",
    summary: "How do we extend a flashlight circuit? By running wires. To save wire, early telegraph systems used a single wire with the earth (ground) as the return path. They used a telegraph key (switch) and sounder (electromagnet receiver) for two-way communication.",
    challenge: "Send a signal to the receiver. Click and hold the telegraph key to send a message, and observe how the current travels through the ground return.",
    hint: "Click and hold the telegraph key to energize the wire and attract the sounder armature."
  },
  {
    num: 6,
    title: "Logic with Switches",
    summary: "Switches can perform logic. Switches in series perform the AND function (both must be closed). Switches in parallel perform the OR function (either can be closed). Complex switch networks can represent boolean equations.",
    challenge: "Toggle the switches to light up the bulb. Switches A and B are in series, and they are in parallel with Switch C. Build the condition where A and B are closed, OR C is closed.",
    hint: "You can either close C, or close both A and B. Click the switches to toggle them."
  },
  {
    num: 7,
    title: "Telegraphs and Relays",
    summary: "Wire resistance weakens signals over distance. The relay solves this. It is an electromagnet that acts as a switch. A weak incoming current activates the electromagnet, pulling down a lever that closes a fresh, high-voltage local circuit, amplifying the signal.",
    challenge: "Press the sender key. Watch the electromagnet coil energize, pulling the contact armature, and closing the secondary battery circuit to light the bulb.",
    hint: "Click the Morse Key. Watch the primary circuit loop energize the coil, which magnetizes and pulls the switch arm down."
  },
  {
    num: 8,
    title: "Relays and Gates",
    summary: "Using normally-open (closes when coil is active) and normally-closed (opens when coil is active) relays, we can build logic gates: NOT, AND, OR, NAND, NOR, and XOR. These gates are the building blocks of all computer logic.",
    challenge: "Find the input combination for the XOR (Exclusive OR) gate that results in an output of 1. What inputs must A and B have?",
    hint: "XOR outputs 1 only when A and B are different. Try setting A=1 and B=0, or A=0 and B=1."
  },
  {
    num: 9,
    title: "Our Ten Digits",
    summary: "We count in Base 10 because we have 10 fingers. Positional number systems use place values based on powers of the base (1s, 10s, 100s, 1000s). We examine how digits represent values through position.",
    challenge: "Stack up the digits to show the current year, 2026. Watch the coins pile up and the powers of 10 add to the total.",
    hint: "Set the thousands to 2, hundreds to 0, tens to 2, and ones to 6."
  },
  {
    num: 10,
    title: "Alternative 10s",
    summary: "What if we had only 8 fingers (octal) or 2 fingers (binary)? The math is exactly the same, but the base changes. In binary, place values are powers of 2 (1, 2, 4, 8, 16...). We convert numbers between these bases.",
    challenge: "Build the number 42 by switching on light bulbs (or typing it), and see it turn into binary '101010'.",
    hint: "Light up the bulbs worth 32, 8, and 2 — they add to 42. Binary '101010' = 32 + 8 + 2 = 42."
  },
  {
    num: 11,
    title: "Bit by Bit by Bit",
    summary: "A 'bit' is a binary digit (0 or 1). Computers represent everything as bits. We look at binary counting and the UPC barcode, which uses 95 binary stripes (guard bars, left digits, center guard, right digits) to represent manufacturer and product codes.",
    challenge: "Scan/decode the UPC barcode by clicking on the stripes. Identify whether the guard patterns (left, center, right) match the standard binary '101' sequences.",
    hint: "Click the Scan Barcode button, which reads the binary pattern of the UPC lines."
  },
  {
    num: 12,
    title: "Bytes and Hexadecimal",
    summary: "Eight bits form a byte. A byte can represent 256 values (0 to 255). To write bytes compactly, we use hexadecimal (Base 16: 0-9, A-F). A byte is divided into two 4-bit 'nibbles', each represented by one hex digit.",
    challenge: "Toggle the 8 bits in the byte inspector to set the byte value to Hexadecimal 'A5' (decimal 165).",
    hint: "Hex 'A' is binary '1010', and hex '5' is binary '0101'. Toggle the bits to read 10100101."
  },
  {
    num: 13,
    title: "From ASCII to Unicode",
    summary: "To represent characters as bytes, we use mapping tables. ASCII maps 128 characters to 7 bits. Unicode expands this to support all languages and emojis, using encodings like UTF-8 where characters take 1 to 4 bytes.",
    challenge: "Type the word 'CODE' in the text input area. Observe the ASCII hex representation generated: 43 4F 44 45.",
    hint: "Type the word CODE in all capital letters in the input box."
  },
  {
    num: 14,
    title: "Adding with Logic Gates",
    summary: "By combining XOR and AND gates, we build a Half Adder (adds 2 bits to produce Sum and Carry). By cascading two Half Adders and an OR gate, we build a Full Adder (adds 2 bits plus a Carry-In). Putting 8 Full Adders together lets us add two bytes.",
    challenge: "Set the Full Adder inputs to A = 1, B = 1, and Carry-In = 0. Verify that the outputs are Sum = 0 and Carry-Out = 1.",
    hint: "Click the A switch to ON, B switch to ON, and Carry-In switch to OFF."
  },
  {
    num: 15,
    title: "Is This for Real?",
    summary: "Relays are slow and noisy. Over time, computers switched to vacuum tubes, then discrete transistors, and finally integrated circuits (ICs) like the 7400 series TTL chips. These chips package multiple gates onto a tiny piece of silicon.",
    challenge: "Connect the inputs of a NAND gate on the virtual 7400 chip to VCC (1) and watch the LED output toggle. What is the output of a NAND gate when both inputs are 1?",
    hint: "NAND outputs 0 when both inputs are 1. Set Input A and Input B to 1 (VCC) and see the LED turn off."
  },
  {
    num: 16,
    title: "But What About Subtraction?",
    summary: "To subtract binary numbers, computers use Two's Complement. We invert all bits of the number we want to subtract (one's complement) and add 1 (by setting the Carry-In to 1). This turns subtraction into addition, saving hardware.",
    challenge: "Perform the subtraction 12 - 5. Set Input A to 12 (00001100), Input B to 5 (00000101), and select the SUBTRACT mode (which inverts B and sets Carry-In to 1).",
    hint: "Set Operand A to 12, Operand B to 5, and click the SUB mode button. Verify that the output is 7 (00000111)."
  },
  {
    num: 17,
    title: "Feedback and Flip-Flops",
    summary: "All circuits so far are combinational (outputs depend only on current inputs). By feeding outputs back into inputs, we get sequential circuits with memory. The SR Latch stores 1 bit. The D Flip-Flop updates its state only on the edge of a Clock pulse.",
    challenge: "Store a 1 in the D Flip-Flop. Set Data (D) to 1, then trigger a Clock pulse (CLK) to latch the value into memory.",
    hint: "Set the Data switch to ON, then click the Clock button to pulse it from 0 to 1 and back."
  },
  {
    num: 18,
    title: "Let's Build a Clock!",
    summary: "A computer needs a clock—an oscillator that alternates between 0 and 1 at a constant speed. Connecting the clock to a flip-flop divides the frequency by 2. Cascading flip-flops creates a binary ripple counter, which can drive a 7-segment display.",
    challenge: "Set the oscillator frequency to 2 Hz (or higher) and start the clock. Watch the counter increment. Stop the clock when the display reads exactly 7.",
    hint: "Click Play, watch the counter increment, and click Pause when the 7-segment display hits 7."
  },
  {
    num: 19,
    title: "An Assemblage of Memory",
    summary: "To store many bytes, we arrange flip-flops in a grid (RAM). We use address decoders to select a row and column. By asserting Write Enable (WE), we write the input byte into the selected grid intersection. Otherwise, we read from it.",
    challenge: "Write the bit value 1 to Address Row 3, Column 5 (address 011101). Toggle the inputs, enable Write, and click Apply.",
    hint: "Set Address Row to 3, Column to 5. Set Data In to 1. Click Write Enable, then click Execute Write."
  },
  {
    num: 20,
    title: "Automating Arithmetic",
    summary: "To add multiple numbers automatically, we need a control sequencer. We load a number from memory into a register called the Accumulator. Then we add another memory value to it. Finally, we store the result back to memory.",
    challenge: "Execute the instruction sequence: 1) LOAD 10 (load value at address 10), 2) ADD 11 (add value at address 11), 3) STORE 12. Run the program to calculate the sum.",
    hint: "Click the Step button through the instruction steps until the program terminates and the sum is written to RAM."
  },
  {
    num: 21,
    title: "The Arithmetic Logic Unit",
    summary: "The ALU is the calculator of the CPU. It takes two inputs (A and B) and performs arithmetic (ADD, SUB) or bitwise logic (AND, OR, XOR, NOT) based on operation selection lines. It also sets status flags (Zero, Carry, Overflow).",
    challenge: "Perform an XOR operation on Input A = 170 (10101010) and Input B = 15 (00001111). Select XOR mode and calculate the output.",
    hint: "Set ALU Mode to XOR, enter A=10101010 and B=00001111, and view the result (should be 10100101 = 165)."
  },
  {
    num: 22,
    title: "Registers and Busses",
    summary: "Moving bytes between ALU, memory, and registers requires wires. Instead of connecting every register to every other, they share a common Bus. Tri-state buffers ensure only one register writes to the bus at a time, preventing short circuits.",
    challenge: "Move the value 85 from Register A to Register C. Enable Register A output to the Bus, and load it into Register C.",
    hint: "Set Reg A Output Enable (OE) to ON. Set Reg C Load (LD) to ON. Pulse the clock."
  },
  {
    num: 23,
    title: "CPU Control Signals",
    summary: "The CPU cycle is Fetch, Decode, Execute. The control unit is a state machine. It uses the clock to assert control signals (like RAM OE, Register Load, ALU select) depending on the instruction loaded in the Instruction Register (IR).",
    challenge: "Step through the Fetch cycle of the LOD instruction. Program Counter (PC) puts address on bus, RAM puts instruction on bus, and Instruction Register (IR) loads it.",
    hint: "Click the Fetch step buttons sequentially to move the instruction from RAM to IR."
  },
  {
    num: 24,
    title: "Loops, Jumps, and Calls",
    summary: "A processor executes sequentially unless a Jump instruction changes the Program Counter. Conditional Jumps (like Jump if Zero) check status flags to perform loops. Jumps also enable subroutines using a Stack (push/pop PC).",
    challenge: "Write/step through a simple assembly loop that decrements Register A from 3 down to 0, jumps back if not zero, and halts when zero.",
    hint: "Click the Run program button or step through each line. Watch the JNZ (Jump Not Zero) trigger until A reaches 0."
  },
  {
    num: 25,
    title: "Peripherals",
    summary: "A CPU needs input/output devices. A keyboard sends a scan code (an interrupt signal) to the CPU when a key is pressed. The video display reads from a dedicated section of RAM (Video RAM) and draws pixels on the screen.",
    challenge: "Type on the keyboard to trigger scan-code interrupts, or click video memory pixels to draw on the screen. Draw a pixel in the video grid.",
    hint: "Click any pixel in the 16x16 display grid to turn it on (writing a 1 to its video RAM location)."
  },
  {
    num: 26,
    title: "The Operating System",
    summary: "An Operating System (OS) is software that manages hardware. It includes a BIOS (basic drivers), a file system to store files in directories, and a CLI (command line interface) or GUI for users to launch programs and manage files.",
    challenge: "Use the terminal to find the secret file. Run the 'dir' command, and then read the secret file using 'cat secret.txt'.",
    hint: "Type 'dir' and press Enter. Locate 'secret.txt', then type 'cat secret.txt' and press Enter."
  },
  {
    num: 27,
    title: "Coding",
    summary: "Writing machine code is tedious. High-level languages (like Javascript) let us write readable code. A compiler parses code into an Abstract Syntax Tree (AST), translates it to Assembly, and compiles it to machine bytes.",
    challenge: "Type a simple assignment statement like 'a = 5 + 3;' and compile it to see the compiled assembly instructions.",
    hint: "Type 'a = 5 + 3' into the editor, and click the Compile button."
  },
  {
    num: 28,
    title: "The World Brain",
    summary: "Computers connect to form the Internet. When you type a URL, the DNS server translates the domain to an IP address. The data is chopped into packets, routed through routers (using IP/TCP protocols), and reassembled at the server.",
    challenge: "Request a web page by entering a URL. Watch the packet travel from client, through the DNS server, and then route through the network hops to the web server.",
    hint: "Type 'petzold.com' in the address bar and click Go. Watch the packets route through the visual nodes."
  }
];

// Attach the author's companion links to the chapters that have them.
export const chaptersData = RAW_CHAPTERS.map((ch) =>
  COMPANION_LINKS[ch.num] ? { ...ch, companion: COMPANION_LINKS[ch.num] } : ch
);
