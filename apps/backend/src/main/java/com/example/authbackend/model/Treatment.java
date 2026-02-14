import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "treatments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Treatment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "content", nullable = true)
    private String content;

    @Column(columnDefinition = "date", nullable = false)
    private LocalDate date; // date -> LocalDate

    @Column(name = "patient_id", nullable = false)
    private Integer patientId;
}