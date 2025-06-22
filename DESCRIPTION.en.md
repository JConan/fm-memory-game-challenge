## Application Description

This application is an interactive memory game designed to challenge and improve users’ memorization abilities. The game offers two difficulty levels: a 4×4 grid for beginners and a 6×6 grid for advanced players. Using React as the main library, the application provides a smooth and responsive user interface, with engaging animations for each matched pair.

## Challenges and Solutions

## Card State Management

#### **Challenge**: Ensure efficient management of card states (flipped, matched, hidden) to avoid unexpected behaviors.  
#### **Solution**: Use hooks like `useState` to manage each card’s state individually and `useEffect` to trigger specific actions when certain conditions are met, such as flipping cards back after a delay if they do not form a match.

## Responsiveness and UX

#### **Challenge**: Ensure the game is playable on various screen sizes, from mobile devices to desktop computers.  
#### **Solution**: Implement media queries to adjust card sizes and spacing, and add CSS animations to make the game visually appealing.

## Time and Score Management

#### **Challenge**: Integrate a timer and scoring system to increase user engagement.  
#### **Solution**: Implement a time counter using `useState` and `useEffect` to update the elapsed time, and calculate the score based on time and number of moves made, displaying it dynamically to the user.
