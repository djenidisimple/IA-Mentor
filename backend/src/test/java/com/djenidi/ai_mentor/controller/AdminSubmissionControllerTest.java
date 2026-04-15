package com.djenidi.ai_mentor.controller;

import com.djenidi.ai_mentor.entity.*;
import com.djenidi.ai_mentor.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "application.security.jwt.secret-key=test-secret",
        "application.security.jwt.expiration=3600"
})
@AutoConfigureMockMvc
@Transactional
public class AdminSubmissionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ChallengeRepository challengeRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Test
    @WithMockUser(roles = "ADMIN")
    public void reviewSubmission_marksReviewed() throws Exception {
        User user = User.builder()
                .username("tester")
                .email("tester@example.com")
                .password("pass")
                .build();
        user = userRepository.save(user);

        Category cat = Category.builder()
                .name("algorithms")
                .slug("algorithms")
                .description("algos")
                .build();
        cat = categoryRepository.save(cat);

        Challenge ch = Challenge.builder()
                .title("Sum numbers")
                .slug("sum-numbers")
                .description("Add numbers")
                .level(ChallengeLevel.DEBUTANT)
                .type(ChallengeType.BACKEND)
                .category(cat)
                .points(10)
                .build();
        ch = challengeRepository.save(ch);

        Submission sub = Submission.builder()
                .user(user)
                .challenge(ch)
                .status(SubmissionStatus.SUBMITTED)
                .githubUrl("https://github.com/example/repo")
                .build();
        sub = submissionRepository.save(sub);

        mockMvc.perform(post("/api/admin/submissions/" + sub.getId() + "/review")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("REVIEWED"))
                .andExpect(jsonPath("$.data.aiFeedback").isNotEmpty());
    }
}
