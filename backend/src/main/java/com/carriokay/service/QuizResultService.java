package com.carriokay.service;

import com.carriokay.model.QuizResult;

public interface QuizResultService {

    QuizResult saveResult(QuizResult result, String email);

    QuizResult getByUser(String email);
}