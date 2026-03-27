package com.djenidi.ai_mentor.entity;

public enum SubmissionStatus {
    IN_PROGRESS,   // L'utilisateur a commencé le challenge
    SUBMITTED,     // L'URL GitHub a été soumise, en attente d'analyse IA
    REVIEWED       // L'IA a terminé l'analyse, feedback disponible
}
