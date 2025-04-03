module MyModule::TokenizedCourseRewards {
    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    
    /// Error codes
    const E_NOT_COURSE_CREATOR: u64 = 1;
    const E_COURSE_ALREADY_EXISTS: u64 = 2;
    const E_COURSE_DOES_NOT_EXIST: u64 = 3;
    const E_INSUFFICIENT_REWARD_BALANCE: u64 = 4;
    
    /// Struct representing a course with token rewards.
    struct Course has key, store {
        creator: address,
        reward_per_completion: u64,  // Reward amount per student who completes the course
        remaining_reward_balance: u64, // Total remaining reward balance
        completion_count: u64,  // Number of students who completed the course
    }
    
    /// Create a new course with token rewards for completion.
    public fun create_course(creator: &signer, reward_per_completion: u64, initial_reward_balance: u64) {
        let creator_address = signer::address_of(creator);
        
        // Check if course already exists
        assert!(!exists<Course>(creator_address), E_COURSE_ALREADY_EXISTS);
        
        // Transfer tokens from creator to fund the reward pool
        let reward_funds = coin::withdraw<AptosCoin>(creator, initial_reward_balance);
        coin::deposit(creator_address, reward_funds);
        
        // Create and store course
        let course = Course {
            creator: creator_address,
            reward_per_completion,
            remaining_reward_balance: initial_reward_balance,
            completion_count: 0,
        };
        
        move_to(creator, course);
    }
    
    /// Award tokens to students who complete the course.
    public fun complete_course(student: &signer, course_creator: address) acquires Course {
        // Verify course exists
        assert!(exists<Course>(course_creator), E_COURSE_DOES_NOT_EXIST);
        
        // Get course and student information
        let course = borrow_global_mut<Course>(course_creator);
        let student_address = signer::address_of(student);
        
        // Check sufficient rewards balance
        assert!(course.remaining_reward_balance >= course.reward_per_completion, E_INSUFFICIENT_REWARD_BALANCE);
        
        // Transfer reward from course balance to student
        let reward_amount = course.reward_per_completion;
        let reward = coin::withdraw<AptosCoin>(&signer::create_signer(course_creator), reward_amount);
        coin::deposit(student_address, reward);
        
        // Update course statistics
        course.remaining_reward_balance = course.remaining_reward_balance - reward_amount;
        course.completion_count = course.completion_count + 1;
    }
}