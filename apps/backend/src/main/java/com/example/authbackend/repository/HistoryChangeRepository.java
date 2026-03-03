package com.example.authbackend.repository;


import com.example.authbackend.model.HistoryChange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistoryChangeRepository extends JpaRepository<HistoryChange, Long> {

    @Query("SELECT hc FROM HistoryChange hc WHERE hc.session.id = :sessionId " )
    List<HistoryChange> findBySessionId(
            @Param("sessionId") Long sessionId);


}
