import { infoTechniquesSU } from "../const";

const AikidoTechniquesPage = () => {
    return (
        <div className="container mx-auto pt-5">
            <h2 className="text-3xl font-bold text-center mb-8">審査技</h2>
            {infoTechniquesSU.map((grade, gradeIndex) => (
                <details key={gradeIndex} className="mb-4 border border-gray-300 rounded-lg shadow-sm">
                    <summary className="text-xl font-semibold cursor-pointer bg-gray-100 p-4 rounded-t-lg">
                        {grade.grade}
                    </summary>
                    <div className="ml-4 p-4 bg-white rounded-b-lg">
                        {grade.attacks.map((attack, attackIndex) => (
                            <details key={attackIndex} className="mb-2 border border-gray-200 rounded-lg">
                                <summary className="text-lg font-medium cursor-pointer bg-gray-50 p-3 rounded-t-lg">
                                    {attack.type}
                                </summary>
                                <ul className="ml-4 p-3 bg-white rounded-b-lg">
                                    {attack.techniques.map((technique, techniqueIndex) => (
                                        <li key={techniqueIndex} className="text-md font-normal py-1">
                                            {technique}
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        ))}
                    </div>
                </details>
            ))}
        </div>
    );
};

export default AikidoTechniquesPage;